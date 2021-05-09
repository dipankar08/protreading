import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, FlatList, Text, TouchableOpacity, useWindowDimensions, View, StyleSheet } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import {
  P,
  Sub,
  A,
  B,
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
  Span,
  I,
  DButton,
} from "../components/basic";
import { TProps } from "./types";
import { AppStateContext } from "../appstate/AppStateStore";
import { TGroupMarketEntry, TKeyText, TMarketEntry } from "../models/model";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import RBSheet from "react-native-raw-bottom-sheet";
import { dlog } from "../libs/dlog";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { useNetwork } from "../hooks/useNetwork";
import { DButtonTag } from "../components/DButton";
import { colors } from "../styles/colors";
import { DDialog } from "../components/DDialog";
import { DKeyValueList } from "../components/DList";
import { globalAppState } from "../appstate/AppStateReducer";

const renderTabBar = (props) => <TabBar {...props} indicatorStyle={{}} style={{ fontSize: 40 }} />;
export const MarketScreen = ({ navigation }: TProps) => {
  const appState = useContext(AppStateContext);
  const network = useNetwork();

  // tab config
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Indicator", navigation: navigation },
    { key: "second", title: "Sector", navigation: navigation },
    { key: "third", title: "Recommend", navigation: navigation },
  ]);

  const renderScene = SceneMap({
    first: MarketListView,
    second: MarketListView,
    third: MarketListView,
  });

  return (
    <DContainerSafe style={{ paddingHorizontal: 0 }}>
      <ScreenHeader title="Market Summary" style={{ padding: 16 }} icon="reload" onPress={network.reLoadAllData}></ScreenHeader>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
      />
    </DContainerSafe>
  );
};

export const MarketListView = ({ route }: TProps) => {
  const appState = useContext(AppStateContext);
  const [listData, setListData] = React.useState<TGroupMarketEntry[]>([]);
  useEffect(() => {
    switch (route.key) {
      case "first":
        setListData(Array.from(appState.state.summary.values()));
        break;
      case "second":
        setListData(Array.from(appState.state.sectorList.values()));
        break;
      case "third":
        setListData(Array.from(appState.state.recommendedList.values()));
        break;
    }
  }, [appState.state.summary, appState.state.sectorList, appState.state.recommendedList]);

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
            <TouchableWithoutFeedback
              onPress={() => {
                route.navigation.navigate("MarketGroupListScreen", {
                  item: item,
                });
              }}
            >
              <DLayoutRow style={{ alignItems: "center", padding: 20 }}>
                <DLayoutCol style={{ flex: 1 }}>
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
                  <Text
                    style={{
                      // backgroundColor: color,
                      color: item.avg_change > 0 ? "green" : "red",
                      fontSize: 12,
                      flex: 1,
                      marginTop: 6,
                      opacity: 0.7,
                    }}
                  >
                    {item.count} stocks {"\u2022"} {item.avg_change.toFixed(2)}% change
                  </Text>
                </DLayoutCol>
                <TouchableOpacity
                  onPress={() => {
                    /* 1. Navigate to the Details route with params */
                    route.navigation.navigate("MarketGroupListScreen", {
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
  const { item } = route.params;
  const [listData, setListData] = React.useState<TMarketEntry[]>([]);
  const [inverted, setInverted] = useState(false);
  const [p2rLoading, setP2rLoading] = useState(false);
  const [visibleIndicator, setVisibleIndicator] = React.useState(false);
  const [selectedEntry, setSelectedEntry] = React.useState<TMarketEntry>();

  const network = useNetwork();
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

  const refRecommendationSheet = useRef<RBSheet>();
  const [recommendationItem, setRecommendationItem] = useState<TMarketEntry>();
  function openBottomSheet(item: TMarketEntry) {
    setRecommendationItem(item);
    refRecommendationSheet.current?.open();
  }

  return (
    <DContainerSafe style={{ paddingHorizontal: 0 }}>
      <ScreenHeader
        title={item.title}
        navigation={navigation}
        style={{ padding: 16 }}
        icon="sort-reverse-variant"
        onPress={() => refRBSheet.current.open()}
      ></ScreenHeader>
      <FlatList
        ref={flatListRef}
        onRefresh={() =>
          network.fetchLatestClose({
            onBefore: () => setP2rLoading(true),
            onComplete: () => setP2rLoading(false),
          })
        }
        refreshing={p2rLoading}
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
                  display: "flex",
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
                <DLayoutRow>
                  <DButtonTag
                    onPress={() => {
                      navigation.navigate("WebViewScreen", {
                        url: `https://uk.tradingview.com/chart/?symbol=NSE:${item.symbol.replace(".NS", "")}&interval=5`,
                      });
                    }}
                    style={{ marginTop: 10, marginRight: 10, backgroundColor: colors.blue600 }}
                    text={"chart"}
                  />
                  <DButtonTag
                    onPress={() => {
                      console.log(item);
                      setSelectedEntry(item);
                      setVisibleIndicator(true);
                    }}
                    style={{ marginTop: 10, marginRight: 10, backgroundColor: colors.blue600 }}
                    text={"indicator"}
                  />
                  {item.recommended_to_buy != undefined && (
                    <DButtonTag
                      onPress={() => {
                        openBottomSheet(item);
                      }}
                      style={{ backgroundColor: "#1e6f5c", marginTop: 10 }}
                      text={"Recommend to buy"}
                    ></DButtonTag>
                  )}
                  {item.recommended_to_sell && (
                    <DButtonTag
                      onPress={() => {
                        openBottomSheet(item);
                      }}
                      style={{ marginTop: 10 }}
                      text={"Recommend to sell"}
                    ></DButtonTag>
                  )}
                </DLayoutRow>
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
          <Button onPress={() => {}} title="Sort By Change"></Button>
          <DSpace />
          <Button onPress={() => {}} title="Sort By Name"></Button>
          <TextWithIcon text={"Sort based on onChangeText"} icon={"sort-ascending"} style={{ paddingVertical: 8 }} onPress={() => {}}></TextWithIcon>
          <TextWithIcon text={"Sort by stock name"} icon={"sort-ascending"} style={{ paddingVertical: 8 }}></TextWithIcon>
        </DLayoutCol>
      </RBSheet>

      {/* Button sheet to show the recomendation */}
      <RBSheet
        ref={refRecommendationSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        customStyles={{
          wrapper: {
            backgroundColor: "transparent",
          },
          draggableIcon: {
            backgroundColor: "#000",
          },
          container: {
            height: 350,
          },
        }}
      >
        <DLayoutCol style={{ paddingHorizontal: 16 }}>
          <Text style={{ marginTop: 16, fontWeight: "bold", fontSize: 12, color: "#00000066", textTransform: "uppercase", marginBottom: 6 }}>
            Recommendation
          </Text>

          {recommendationItem?.recommended_to_buy && <Text style={{ fontSize: 20, color: "black" }}>Recommend to buy</Text>}
          {recommendationItem?.recommended_to_sell && <Text style={{ fontSize: 20, color: "black" }}>Recommend to sell</Text>}

          <Text style={{ marginTop: 16, fontWeight: "bold", fontSize: 12, color: "#00000088", textTransform: "uppercase", marginBottom: 10 }}>
            What we recommending this?
          </Text>

          {recommendationItem?.recommended_to_buy && <Text style={{ fontSize: 13, color: "black" }}>{recommendationItem.recommended_to_buy} </Text>}
          {recommendationItem?.recommended_to_sell && <Text style={{ fontSize: 13, color: "black" }}>{recommendationItem.recommended_to_sell}</Text>}

          <Text style={{ marginTop: 30, fontWeight: "bold" }}>Love this Recommendation?</Text>
          <DButton> Get a Free invitation for Intra day!</DButton>
        </DLayoutCol>
      </RBSheet>
      <DDialog
        title={"Indicator List"}
        visible={visibleIndicator}
        onCancel={() => {
          setVisibleIndicator(false);
        }}
      >
        <DKeyValueList object={selectedEntry?.indicator}></DKeyValueList>
      </DDialog>
    </DContainerSafe>
  );
};

const styles = StyleSheet.create({});
