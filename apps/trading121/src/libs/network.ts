import axios from "axios";
import { TObject } from "../models/model";
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

// Be explict if you wnats to improve perf
export async function getRequest(url: string, cacheKey?: string, cache_first = false) {
  console.log("try fetching " + url);
  if (cache_first && cacheKey) {
    console.log("[Network]Trying cache first..");
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

// No try catch here
export async function postRequest(url: string, data: TObject) {
  console.log("[Network] posting " + url);
  let response = await axios.post(url, data);
  const jsondata: any = response.data;
  if (jsondata.status == "success") {
    console.log("post success...");
    return jsondata.out;
  } else {
    console.log("post failed....");
    throw new Error("Server sends error");
  }
}
