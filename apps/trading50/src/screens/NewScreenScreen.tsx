import React, { useContext } from "react";
import { useWindowDimensions } from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { AppStateContext } from "../appstate/AppStateStore";
import { DContainerSafe, DLayoutCol, ScreenHeader } from "../components/basic";
import { DTextInput } from "../components/DInput";
import { useNetwork } from "../hooks/useNetwork";
import { showNotification } from "../libs/uihelper";
import { TMarketEntry } from "../models/model";
import { DIMENS } from "../res/dimens";
import navigation from "./navigation";
import { TickerListView } from "./TickerListView";
import { TProps } from "./types";
const renderTabBar = (props) => <TabBar {...props} indicatorStyle={{}} style={{ fontSize: 40 }} />;

export let NewScreenScreen = () => {
  const network = useNetwork();
  const appState = useContext(AppStateContext);
  // tab config
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [queryStr, setInsetQueryStr] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "first",
      title: "Filter",
      navigation: navigation,
      onChangeText: (q: str) => {
        // console.log(q);
        setInsetQueryStr(q);
      },
    },
    {
      key: "second",
      title: "Result",
      navigation: navigation,
    },
  ]);

  const renderScene = SceneMap({
    first: FilterView,
    second: ResultView,
  });

  return (
    <DContainerSafe style={{ paddingHorizontal: 0 }}>
      <ScreenHeader
        title="Execute Screen"
        style={{ padding: 16 }}
        icon="play"
        loading={loading}
        onPress={() => {
          network.performScreen(queryStr, {
            onBefore: () => {
              setLoading(true);
            },
            onSuccess: (result) => {
              let data: Array<TMarketEntry> = [];
              for (let x of result) {
                data.push({
                  symbol: x.symbol,
                  close: x.close,
                  change: x.change,
                  name: x.name,
                  _id: x.symbol,
                  rsi: x.rsi_14,
                });
              }
              //console.log(data);
              appState.dispatch({ type: "MERGE", payload: { screenResultList: data } });
              setLoading(false);
              showNotification("Got the result!");
            },
            onError: (result) => {
              appState.dispatch({ type: "MERGE", payload: { screenResultList: [] } });
              setLoading(false);
              showNotification(result || "Error happened while screening");
            },
          });
        }}
      ></ScreenHeader>
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

const FilterView = ({ route }: TProps) => {
  return (
    <DLayoutCol style={{ marginHorizontal: DIMENS.GAP_BETWEEN_ELEMENT }}>
      <DTextInput onChangeText={route.onChangeText} multiline={true} style={{ maxHeight: 500 }}></DTextInput>
    </DLayoutCol>
  );
};

const ResultView = ({ route }: TProps) => {
  const appState = useContext(AppStateContext);
  return (
    <DLayoutCol style={{ marginHorizontal: 0 }}>
      <TickerListView objArray={appState.state.screenResultList}></TickerListView>
    </DLayoutCol>
  );
};
