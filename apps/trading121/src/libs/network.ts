import axios from "axios";
import { getData, saveData } from "./stoarge";

export async function loadLatestData() {
  let response = await axios.get("https://dev.api.grodok.com:5000/latest?candle_type=5m");
  const jsondata: any = response.data;
  if (jsondata.status == "success") {
    let data = jsondata.out.data; // This contains the map.
    if (Object.keys.length == 0) {
      throw new Error("Empty data");
    }
    return data;
  } else {
    throw new Error("Server sends error");
  }
}

export async function getRequest(url: string, cacheKey?: string, cache_first = true) {
  console.log("try fetching " + url);
  if (cache_first && cacheKey) {
    console.log("Trying cache first..");
    let data = await getData(cacheKey);
    if (data) {
      return data;
    }
  }
  let response = await axios.get(url);
  const jsondata: any = response.data;
  if (jsondata.status == "success") {
    console.log("fetch success...");
    if (cacheKey) {
      await saveData(cacheKey, jsondata.out);
    }
    return jsondata.out;
  } else {
    console.log("fetch failed....");
    throw new Error("Server sends error");
  }
}
