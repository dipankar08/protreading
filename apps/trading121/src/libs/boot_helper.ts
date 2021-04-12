import axios from "axios";
import React from "react";
import { Alert } from "react-native";
import Toast from "react-native-simple-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TObject } from "./market_helper";

export let latestMarketCacheData: Map<string, TObject> = new Map();

export const userBoot = () => {
  const [latestData, setLatestData] = React.useState<Map<string, TObject>>();
  const [isComplete, setIsComplete] = React.useState<boolean>(false);
  async function loadLatestData() {
    try {
      let response = await axios.get("https://dev.api.grodok.com:5000/latest?candle_type=5m");
      const jsondata: any = response.data;
      if (jsondata.status == "success") {
        let data = jsondata.out.data; // This contains the map.
        //console.log(data);
        let result = new Map<string, TObject>();
        for (let x of Object.keys(data)) {
          result.set(x, data[x]);
        }
        latestMarketCacheData = result;
        setLatestData(result);
        setIsComplete(true);
        // Save data
        try {
          await AsyncStorage.setItem("MARKET_LATEST", JSON.stringify(result));
          console.log("[LATEST DATA] latest data  saved in cache");
        } catch (e) {
          console.log("[LATEST DATA] Not able to store latest data in the cache");
        }
        console.log("[LATEST DATA] loaded successfully");
        // console.log(result);
      } else {
        console.log("[LATEST DATA]  Status error : Not able to load latest data");
      }
    } catch (e) {
      console.log(e);
      console.log("[LATEST DATA] Exception not able to load latest data");
    }
  }

  async function bootApp() {
    console.log("[BOOT] Staring boot");
    try {
      console.log("latest dtaa trying to get from cache...");
      const value1 = await AsyncStorage.getItem("MARKET_LATEST");
      if (value1 !== null) {
        console.log("got it from cache...");
        let data = JSON.parse(value1);
        setLatestData(data);
        latestMarketCacheData = data;
        setIsComplete(true);
        console.log("Latest set is set now");
        return;
      } else {
        console.log("cache not found -- trying to load from network");
        await loadLatestData();
      }
    } catch (e) {
      console.log("cache not found ( Exception) -- trying to load from network");
      await loadLatestData();
    }
  }

  React.useEffect(() => {
    bootApp();
  }, []);

  return { isComplete, latestData };
};
