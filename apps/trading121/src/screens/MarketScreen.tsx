import React, { useContext, useRef, useState } from "react";
import { Button, FlatList, Text, TouchableOpacity, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import {
  DCard,
  DContainer,
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
import { CACHE_KEY_SUMMARY, CACHE_KEY_MARKET } from "../appstate/CONST";
import { processSummaryData } from "../models/processor";
import { TKeyText, TMarketEntry } from "../models/model";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import RBSheet from "react-native-raw-bottom-sheet";

export const MarketScreenList = ({ navigation }: TProps) => {
  const appState = useContext(AppStateContext);
  return (
    <DContainer style={{ paddingHorizontal: 0 }}>
      <ScreenHeader title="Market Summary" style={{ padding: 16 }} icon="sort-reverse-variant"></ScreenHeader>
      <FlatList
        ItemSeparatorComponent={FlatListItemSeparator}
        showsHorizontalScrollIndicator={false}
        data={appState.state.summary?.tags}
        keyExtractor={(item) => item.key}
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
                  {item.text}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    /* 1. Navigate to the Details route with params */
                    navigation.navigate("Market", {
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
    </DContainer>
  );
};

export const MarketScreen = ({ navigation, route }: TProps) => {
  const appState = useContext(AppStateContext);
  const { item } = route.params;
  const [loading, setLoading] = React.useState(false);
  const [listData, setListData] = React.useState<TMarketEntry[]>([]);
  const [inverted, setInverted] = useState(false);

  let isSubscribed = false;
  const refRBSheet = useRef();
  const flatListRef = useRef<FlatList<TMarketEntry>>();
  let name = "Market";
  async function reload() {
    console.log("[NETWORK] fetching from network ");
    setLoading(true);
    try {
      let summary = await getRequest("https://dev.api.grodok.com:5000/summary", CACHE_KEY_SUMMARY, false);
      let market = await getRequest("https://dev.api.grodok.com:5000/latest?candle_type_5m", CACHE_KEY_MARKET, false);
      if (!isSubscribed) return;
      appState.dispatch({ type: "UPDATE_SUMMARY", payload: processSummaryData(summary) });
      appState.dispatch({ type: "UPDATE_MARKET", payload: processSummaryData(market) });
    } catch (e) {
      if (!isSubscribed) return;
      //setError("Not able to get Data");
    }
  }

  React.useEffect((): any => {
    console.log(`Mounted ${name}`);
    if (appState.state.summary) {
      setListData(appState.state.summary?.data[item.key]);
    }
    console.log(item);
    isSubscribed = true;
    return () => {
      console.log(`Unmounted ${name}`);
      isSubscribed = false;
    };
  }, []);

  let sortState = 1;
  function performSort(type: "name" | "change") {
    setInverted(!inverted);
    flatListRef?.current?.scrollToOffset({ animated: true, offset: 0 });
    /*
    console.log('"performSort" called' + type);
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
    <DContainer style={{ paddingHorizontal: 0 }}>
      <ScreenHeader
        title={item.key}
        navigation={navigation}
        style={{ padding: 16 }}
        icon="sort-reverse-variant"
        onPress={() => refRBSheet.current.open()}
      ></ScreenHeader>
      <FlatList
        ref={flatListRef}
        onRefresh={() => reload()}
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
    </DContainer>
  );
};
