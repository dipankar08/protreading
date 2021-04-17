import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, FlatList, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import {
  DCard,
  DContainer,
  DContainerSafe,
  DLayoutCol,
  DLayoutRow,
  DListEmptyComponent,
  DSpace,
  FlatListItemSeparator,
  ScreenHeader,
  TextWithIcon,
} from "../components/basic";
import { TProps } from "./types";
import { AppStateContext } from "../appstate/AppStateStore";
import { getRequest } from "../libs/network";
import { CACHE_KEY_SUMMARY, CACHE_KEY_MARKET, PRO_TRADING_SERVER } from "../appstate/CONST";
import { processMarketData, processSummaryData } from "../models/processor";
import { TGroupMarketEntry, TKeyText, TMarketEntry } from "../models/model";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import RBSheet from "react-native-raw-bottom-sheet";
import { dlog } from "../libs/dlog";
import { SceneMap, TabView } from "react-native-tab-view";

export const useNetwork = () => {
  const appState = useContext(AppStateContext);
  const [loading, setLoading] = React.useState(false);
  async function reLoadAllData() {
    dlog.d("[NETWORK] fetching from network ");
    setLoading(true);
    try {
      let summary = await getRequest(`${PRO_TRADING_SERVER}/summary`, CACHE_KEY_SUMMARY, false);
      dlog.d("SUMMARY FETACH DONE");
      let market = await getRequest(`${PRO_TRADING_SERVER}/latest?candle_type_5m`, CACHE_KEY_MARKET, false);
      dlog.d("MARKET FETACH DONE");
      appState.dispatch({ type: "UPDATE_SUMMARY", payload: processSummaryData(summary) });
      appState.dispatch({ type: "UPDATE_MARKET", payload: processMarketData(market) });
      setLoading(false);
      dlog.d("[NETWORK] fetching from network complete ");
    } catch (e) {
      //setError("Not able to get Data");
      setLoading(false);
      dlog.d("[NETWORK] fetching from network failed ");
      dlog.ex(e);
    }
  }
  return { loading, reLoadAllData };
};

export const MarketScreen = ({ navigation }: TProps) => {
  const appState = useContext(AppStateContext);
  const { loading, reLoadAllData } = useNetwork();

  // tab config
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Indicator View" },
    { key: "second", title: "Sector View" },
  ]);

  const renderScene = SceneMap({
    first: MarketListView,
    second: MarketListView,
  });

  return (
    <DContainerSafe style={{ paddingHorizontal: 0 }}>
      <ScreenHeader title="Market Summary" style={{ padding: 16 }} icon="reload" onPress={reLoadAllData}></ScreenHeader>
      <TabView navigationState={{ index, routes }} renderScene={renderScene} onIndexChange={setIndex} initialLayout={{ width: layout.width }} />
    </DContainerSafe>
  );
};

export const MarketListView = ({ route, navigation }: TProps) => {
  const appState = useContext(AppStateContext);
  const [listData, setListData] = React.useState<TGroupMarketEntry[]>([]);

  useEffect(() => {
    dlog.obj(appState.state.summary);
    if (route.key == "first") {
      // if (appState.state.summary) setListData(appState.state.summary.data.values());
    } else {
      //setListData(appState.state.market?.sectorList.values());
    }
  }, [appState.state.summary, appState.state.market]);

  return (
    <DContainerSafe style={{ paddingHorizontal: 0 }}>
      <FlatList
        ItemSeparatorComponent={FlatListItemSeparator}
        showsHorizontalScrollIndicator={false}
        data={listData}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={DListEmptyComponent}
        renderItem={({ item }) => {
          return (
            <TouchableWithoutFeedback onPress={() => {}}>
              <DLayoutRow style={{ alignItems: "center", padding: 20 }}>
                <Text
                  style={{
                    // backgroundColor: color,
                    color: "black",
                    fontSize: 16,
                    borderRadius: 15,
                    textTransform: "uppercase",
                    flex: 1,
                  }}
                >
                  {item.title}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    /* 1. Navigate to the Details route with params */
                    navigation.navigate("MarketGroupListScreen", {
                      item: item,
                    });
                  }}
                >
                  <MaterialCommunityIcons name={"trending-neutral"} color="black" size={24} style={{ marginLeft: 10 }} />
                </TouchableOpacity>
              </DLayoutRow>
            </TouchableWithoutFeedback>
          );
        }}
      />
    </DContainerSafe>
  );
};

export const MarketGroupListScreen = ({ navigation, route }: TProps) => {
  const appState = useContext(AppStateContext);
  const { item } = route.params;
  const [listData, setListData] = React.useState<TMarketEntry[]>([]);
  const [inverted, setInverted] = useState(false);
  const { loading, reLoadAllData } = useNetwork();

  let isSubscribed = false;
  const refRBSheet = useRef();
  const flatListRef = useRef<FlatList<TMarketEntry>>();
  let name = "Market";
  React.useEffect((): any => {
    dlog.d(`Mounted ${name}`);
    setListData(item.group);
    isSubscribed = true;
    return () => {
      dlog.d(`Unmounted ${name}`);
      isSubscribed = false;
    };
  }, []);

  let sortState = 1;
  function performSort(type: "name" | "change") {
    setInverted(!inverted);
    flatListRef?.current?.scrollToOffset({ animated: true, offset: 0 });
    /*
    dlog.d('"performSort" called' + type);
    let data: TMarketEntry[] = [];
    switch (type) {
      case "change":
        sortState = -1 * sortState;
        data = listData.sort(function (a, b) {
          return a.change < b.change ? sortState : -1 * sortState;
        });
      case "name":
        setListData(
          listData.sort(function (a, b) {
            if (a.change < b.change) {
              return -1;
            }
            if (a.change > b.change) {
              return 1;
            }
            return 0;
          })
        );
    }
    setListData(data.slice(1, 3));
    setListData(data.reverse()); */
  }

  return (
    <DContainerSafe style={{ paddingHorizontal: 0 }}>
      <ScreenHeader
        title={item.key}
        navigation={navigation}
        style={{ padding: 16 }}
        icon="sort-reverse-variant"
        onPress={() => refRBSheet.current.open()}
      ></ScreenHeader>
      <FlatList
        ref={flatListRef}
        onRefresh={() => reLoadAllData()}
        refreshing={loading}
        data={listData}
        inverted={inverted}
        keyExtractor={(item, index) => item.name}
        scrollsToTop={true}
        ListEmptyComponent={DListEmptyComponent}
        ItemSeparatorComponent={FlatListItemSeparator}
        renderItem={({ item }) => {
          return (
            <DLayoutRow style={{ padding: 16 }}>
              <View
                style={{
                  flex: 2,
                  flexDirection: "column",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: "#00000090",
                  }}
                >
                  {item.name}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#00000050",
                    paddingTop: 5,
                  }}
                >
                  {item.symbol}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  alignItems: "flex-end",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: item.change > 0 ? "green" : "red",
                  }}
                >
                  {item.close}
                </Text>
                <Text
                  style={{
                    opacity: 0.7,
                    fontSize: 12,
                    textAlign: "right",
                    color: item.change > 0 ? "green" : "red",
                  }}
                >
                  {item.change}%
                </Text>
              </View>
            </DLayoutRow>
          );
        }}
      ></FlatList>
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        customStyles={{
          wrapper: {
            backgroundColor: "transparent",
          },
          draggableIcon: {
            backgroundColor: "#000",
          },
        }}
      >
        <DLayoutCol style={{ paddingHorizontal: 16 }}>
          <Button onPress={() => performSort("change")} title="Sort By Change"></Button>
          <DSpace />
          <Button onPress={() => performSort("name")} title="Sort By Name"></Button>
          <TextWithIcon
            text={"Sort based on onChangeText"}
            icon={"sort-ascending"}
            style={{ paddingVertical: 8 }}
            onPress={() => performSort("change")}
          ></TextWithIcon>
          <TextWithIcon text={"Sort by stock name"} icon={"sort-ascending"} style={{ paddingVertical: 8 }}></TextWithIcon>
        </DLayoutCol>
      </RBSheet>
    </DContainerSafe>
  );
};
