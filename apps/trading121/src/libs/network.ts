import axios from "axios";
import { PRO_TRADING_SERVER } from "../appstate/CONST";
import { TObject } from "../models/model";
import { dlog } from "./dlog";
import { getData, saveData } from "./stoarge";

export async function loadLatestData() {
  let response = await axios.get(`${PRO_TRADING_SERVER}/latest?candle_type=5m`);
  const jsondata: any = response.data;
  if (jsondata.status == "success") {
    let data = jsondata.out.data; // This contains the map.
    if (Object.keys.length == 0) {
      throw new Error("Empty data");
    }
    return data;
  } else {
    throw new Error(`Server sends error:${response.data}`);
  }
}

// Defau;lt use cacche
export async function getRequest(url: string, cacheKey?: string | null, cache_first = true) {
  dlog.d("try fetching " + url);
  if (cache_first && cacheKey) {
    dlog.d("[Network]Trying cache first..");
    let data = await getData(cacheKey);
    if (data) {
      return data;
    }
  }
  let response = await axios.get(url);
  const jsondata: any = response.data;
  if (jsondata.status == "success") {
    dlog.d("fetch success...");
    if (cacheKey) {
      await saveData(cacheKey, jsondata.out);
    }
    return jsondata.out;
  } else {
    dlog.d(`get failed....${JSON.stringify(response.data)}`);
    throw new Error("Server sends error");
  }
}

// No try catch here
export async function postRequest(url: string, data: TObject) {
  dlog.d(`[Network] posting url:${url}, data: ${JSON.stringify(data)}`);
  let response = await axios.post(url, data);
  const jsondata: any = response.data;
  if (jsondata.status == "success") {
    dlog.d("post success...");
    return jsondata.out;
  } else {
    //dlog.d(`post failed....${JSON.stringify(response.data)}`);
    throw new Error("Server sends error");
  }
}
