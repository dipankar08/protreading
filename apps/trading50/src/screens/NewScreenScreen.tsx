import React, { useContext, useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { AppStateContext } from "../appstate/AppStateStore";
import { DContainerSafe, DLayoutCol, DText, ScreenHeader } from "../components/basic";
import { DButtonPrimary } from "../components/DButton";
import { DDialog } from "../components/DDialog";
import { DTextInput } from "../components/DInput";
import { DLayoutRow } from "../components/DLayout";
import { useNetwork } from "../hooks/useNetwork";
import { showNotification } from "../libs/uihelper";
import { TMarketEntry } from "../models/model";
import { DIMENS } from "../res/dimens";
import { TickerListView } from "./TickerListView";
import { TProps } from "./types";
const renderTabBar = (props) => <TabBar {...props} indicatorStyle={{}} style={{ fontSize: 40 }} />;

export let NewScreenScreen = ({ navigation, route }: TProps) => {
  // tab config
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "first",
      title: "Filter",
      navigation: navigation,
      query: route?.params?.filter || "",
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
      <ScreenHeader title="Execute Screen" style={{ padding: 16 }} navigation={navigation}></ScreenHeader>
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
  const [query, setQuery] = useState("");
  const [querytitle, setQueryTitle] = useState("");
  const [queryDesc, setQueryDesc] = useState("");
  const [queryTag, setQueryTag] = useState("");
  const [loadingRun, setLoadingRun] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const network = useNetwork();
  const appState = useContext(AppStateContext);
  useEffect(() => {
    setQuery(route.query);
  }, []);

  const [saveDialogVisible, setSaveDialogVisible] = useState(false);
  return (
    <DLayoutCol style={{ marginHorizontal: DIMENS.GAP_BETWEEN_ELEMENT }}>
      <DTextInput onChangeText={(x) => setQuery(x)} multiline={true} style={{ maxHeight: 500 }}>
        {query}
      </DTextInput>
      <DLayoutRow style={{ justifyContent: "space-around" }}>
        <DButtonPrimary
          onPress={() =>
            network.performScreen(query, {
              onBefore: () => setLoadingRun(true),
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
                appState.dispatch({ type: "MERGE", payload: { screenResultList: data } });
                setLoadingRun(false);
                showNotification("Got the result!");
              },
              onError: (result) => {
                appState.dispatch({ type: "MERGE", payload: { screenResultList: [] } });
                setLoadingRun(false);
                showNotification(result || "Error happened while screening");
              },
            })
          }
        >
          RUN
        </DButtonPrimary>
        <DButtonPrimary onPress={() => setSaveDialogVisible(true)}>Save</DButtonPrimary>
      </DLayoutRow>

      <DDialog visible={saveDialogVisible} title="Save this query" style={{ height: "auto" }} onCancel={() => setSaveDialogVisible(false)}>
        <DLayoutCol style={{ marginHorizontal: 10 }}>
          <DTextInput placeholder="Enter Title" onChangeText={(x) => setQueryTitle(x)}></DTextInput>
          <DTextInput placeholder="Enter description" onChangeText={(x) => setQueryDesc(x)}></DTextInput>
          <DTextInput placeholder="tags" onChangeText={(x) => setQueryTag(x)}></DTextInput>
          <DText>{query || "<query>"}</DText>
          <DButtonPrimary
            onPress={() => {
              network.saveNewScreen(
                { title: querytitle, desc: queryDesc, tag: queryTag.split(","), filter: query },
                {
                  onBefore: () => setLoadingSave(true),
                  onSuccess: () => {
                    showNotification("Saved!");
                    setSaveDialogVisible(false);
                  },
                  onError: (err) => showNotification(err),
                  onComplete: () => setLoadingSave(false),
                }
              );
            }}
          >
            Save
          </DButtonPrimary>
        </DLayoutCol>
      </DDialog>
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
