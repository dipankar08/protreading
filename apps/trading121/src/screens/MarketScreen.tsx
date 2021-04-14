import React, { useContext, useState } from "react";
import { Button, FlatList, Text, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { DCard, DContainer, DLayoutCol, DLayoutRow } from "../components/basic";
import { TProps } from "./types";
import { AppStateContext } from "../appstate/AppStateStore";
import { getRequest } from "../libs/network";
import { CACHE_KEY_SUMMARY, CACHE_KEY_MARKET } from "../appstate/CONST";
import { processSummaryData } from "../models/processor";
import { TKeyText } from "../models/model";

export const MarketScreen = ({ navigation }: TProps) => {
  const appState = useContext(AppStateContext);

  const [selectedListKey, setSelectedListKey] = useState("all_data");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  let isSubscribed = false;

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
      setError("Not able to get Data");
    }
  }

  React.useEffect((): any => {
    console.log("[MOUNT] MArket screen");
    isSubscribed = true;
    return () => {
      console.log("[Unmount] Market screen");
      isSubscribed = false;
    };
  }, []);

  function actionOnRow(item: TKeyText) {
    //console.log("Selected Item :", item);
    setSelectedListKey(item.key);
  }

  return (
    <DContainer>
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        data={appState.state.summary?.tags}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => {
          let color = item.key === selectedListKey ? "#000000ff" : "#00000090";
          return (
            <TouchableWithoutFeedback onPress={() => actionOnRow(item)}>
              <Text
                style={{
                  backgroundColor: color,
                  color: "white",
                  fontSize: 12,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 15,
                  marginRight: 10,
                  marginBottom: 20,
                  marginTop: 20,
                  textTransform: "capitalize",
                }}
              >
                {item.text}
              </Text>
            </TouchableWithoutFeedback>
          );
        }}
      />

      <FlatList
        onRefresh={() => reload()}
        refreshing={loading}
        data={appState.state.summary?.data[selectedListKey]}
        keyExtractor={(item, index) => item.name}
        scrollsToTop={true}
        renderItem={({ item }) => {
          return (
            <DCard
              overrideStyle={{
                padding: 10,
                height: 80,
              }}
            >
              <DLayoutRow>
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
                    {`${
                      item.change > 0
                        ? "                                                                                                                     +"
                        : "-"
                    } ${item.change}%`}
                  </Text>
                </View>
              </DLayoutRow>
            </DCard>
          );
        }}
      ></FlatList>
    </DContainer>
  );
};
