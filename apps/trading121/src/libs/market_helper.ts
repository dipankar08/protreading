import axios from "axios";
import React from "react";
import { Alert } from "react-native";
import Toast from "react-native-simple-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type TKeyText = {
  key: string;
  text: string;
};

export type TMarketEntry = {
  symbol: string;
  name: string;
  close: number;
  change: number;
};

export const userMarket = () => {
  const [summary, setSummary] = React.useState<Map<string, Array<TMarketEntry>>>();

  const [marketKey, setMarketKey] = React.useState<Array<TKeyText>>();

  const [loading, setLoading] = React.useState(false);
  const [selectedListKey, setSelectedListKey] = React.useState("all_data");

  async function loadFromNetwork() {
    console.log("[NETWORK] fetching from network ");
    try {
      let response = await axios.get("https://dev.api.grodok.com:5000/summary");
      const jsondata: any = JSON.parse(response.data);
      if (jsondata.status == "success") {
        let data = jsondata.out;
        try {
          await AsyncStorage.setItem("MARKET_SUMMARY", JSON.stringify(data));
          console.log("data saved in cache");
        } catch (e) {
          console.log("Not able to store data in the cache");
        }
        processData(data);
        Toast.show("retrieved  market summary", Toast.SHORT);
      } else {
        Toast.show("Not able to retrieve  market summary", Toast.SHORT);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      Toast.show("Not able to retrieve  market summary", Toast.SHORT);
    }
  }

  function processData(obj: any) {
    let result = new Map<string, Array<TMarketEntry>>();
    for (let c of Object.keys(obj)) {
      result.set(c, obj[c].data);
    }
    setSummary(result);
    let keys = Object.keys(obj);
    setMarketKey(
      keys.map((x) => {
        return { key: x, text: x.replace("_", " ") };
      })
    );
  }

  async function loadDataOnBoot() {
    // check cache
    try {
      const value = await AsyncStorage.getItem("MARKET_SUMMARY");
      if (value !== null) {
        console.log("got it from cache...");
        processData(JSON.parse(value));
        return;
      } else {
        await loadFromNetwork();
      }
    } catch (e) {
      await loadFromNetwork();
    }
  }

  React.useEffect(() => {
    loadDataOnBoot();
  }, []);

  return { loading, marketKey, summary, selectedListKey, setSelectedListKey, loadFromNetwork };
};
