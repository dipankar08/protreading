import { default as React, default as React, useContext, useEffect } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { AppStateContext } from "../appstate/AppStateStore";
import { DContainerSafe, DLayoutCol, DLayoutRow, DListEmptyComponent, FlatListItemSeparator, ScreenHeader } from "../components/basic";
import { useNetwork } from "../hooks/useNetwork";
import { dlog } from "../libs/dlog";
import { TGroupMarketEntry } from "../models/model";
import { TickerListView } from "./TickerListView";
import { TProps } from "./types";

const renderTabBar = (props) => <TabBar {...props} indicatorStyle={{}} style={{ fontSize: 40 }} />;
export const MarketScreen = ({ navigation }: TProps) => {
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
  let isSubscribed = false;
  let name = "Market";
  React.useEffect((): any => {
    dlog.d(`Mounted ${name}`);
    isSubscribed = true;
    return () => {
      dlog.d(`Unmounted ${name}`);
      isSubscribed = false;
    };
  }, []);
  return (
    <DContainerSafe style={{ paddingHorizontal: 0 }}>
      <ScreenHeader title={item.title} navigation={navigation} style={{ padding: 16 }} icon="sort-reverse-variant"></ScreenHeader>
      <TickerListView objArray={item.group} navigation={navigation}></TickerListView>
    </DContainerSafe>
  );
};

const styles = StyleSheet.create({});
