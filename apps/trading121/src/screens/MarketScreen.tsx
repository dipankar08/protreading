import axios from "axios";
import React from "react";
import { Button, FlatList, Text, View, ToastAndroid } from "react-native";
import { TouchableOpacity, TouchableWithoutFeedback } from "react-native-gesture-handler";
import { ScreenContainer } from "react-native-screens";
import { DCard, DContainer, DLayout, DLayoutCol, DLayoutRow } from "../components/basic";
import { TProps } from "./types";

export const MarketScreen = ({ navigation }: TProps) => {
  const [summary, setSummary] = React.useState({
    "52_weeks_low": [],
    all_data: [],
  });

  const [marketKey, setMarketKey] = React.useState([
    { key: "all_data", text: "All Data" },
    { key: "52_weeks_low", text: "All Data" },
    { key: "52_weeks_high", text: "All Data" },
    { key: "52_weeks_low1", text: "All Data" },
    { key: "52_weeks_low2", text: "All Data" },
  ]);

  const [loading, setLoading] = React.useState(false);
  const [selectedListKey, setSelectedListKey] = React.useState("all_data");

  async function fetchMyAPI() {
    console.log("calling... ");
    try {
      let response = await axios.get("https://dev.api.grodok.com:5000/summary");
      const jsondata: any = JSON.parse(response.data);
      if (jsondata.status == "success") {
        setSummary(jsondata.out);
        let keys = Object.keys(jsondata.out);
        setMarketKey(
          keys.map((x) => {
            return { key: x, text: x.replace("_", " ") };
          })
        );
        ToastAndroid.show("retrieved  market summary", ToastAndroid.SHORT);
      } else {
        ToastAndroid.show("Not able to retrieve  market summary", ToastAndroid.SHORT);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      ToastAndroid.show("Not able to retrieve  market summary", ToastAndroid.SHORT);
    }
  }

  // This is called when rendered
  React.useEffect(() => {
    setLoading(true);
    console.log("calling... ");
    fetchMyAPI();
  }, []);

  function actionOnRow(item) {
    console.log("Selected Item :", item);
    setSelectedListKey(item.key);
  }

  return (
    <DContainer>
      <FlatList
        horizontal={true}
        data={marketKey}
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
        onRefresh={() => fetchMyAPI()}
        refreshing={loading}
        data={summary[selectedListKey].data}
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
