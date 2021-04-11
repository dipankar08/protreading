import axios from "axios";
import React from "react";
import { Button, FlatList, Text, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { DCard, DContainer, DLayoutCol, DLayoutRow } from "../components/basic";
import { TProps } from "./types";
import Toast from "react-native-simple-toast";
import { TKeyText, userMarket } from "../libs/market_helper";

export const MarketScreen = ({ navigation }: TProps) => {
  const { loading, marketKey, summary, selectedListKey, setSelectedListKey, loadFromNetwork } = userMarket();

  function actionOnRow(item: TKeyText) {
    console.log("Selected Item :", item);
    setSelectedListKey(item.key);
  }

  return (
    <DContainer>
      <FlatList
        showsHorizontalScrollIndicator={false}
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
        onRefresh={() => loadFromNetwork()}
        refreshing={loading}
        data={summary?.get(selectedListKey)}
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
