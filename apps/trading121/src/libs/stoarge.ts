import AsyncStorage from "@react-native-async-storage/async-storage";
import { TObject } from "../models/model";
import { dlog } from "./dlog";

export async function setBool(key: string, value: boolean) {
  try {
    await AsyncStorage.setItem(key, value ? "1" : "0");
    dlog.d("[STORAGE] latest data  saved in cache");
  } catch (e) {
    dlog.d("[STORAGE] Not able to store latest data in the cache");
  }
}

export async function getBool(key: string) {
  try {
    return (await AsyncStorage.getItem(key)) == "1";
  } catch (e) {
    dlog.d(e);
    return false;
  }
}
export async function saveData(key: string, value: TObject) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    dlog.d("[STORAGE] latest data  saved in cache");
  } catch (e) {
    dlog.d("[STORAGE] Not able to store latest data in the cache");
  }
}

export async function getData(key: string, defl = null) {
  try {
    let data = await AsyncStorage.getItem(key);
    if (data) {
      dlog.d("[STORAGE] loaded data");
      return JSON.parse(data);
    } else {
      return defl;
    }
  } catch (e) {
    dlog.d(e);
    return defl;
  }
}

export async function deleteData(key: string) {
  try {
    await AsyncStorage.setItem(key, "");
    dlog.d("[STORAGE] Delete data ");
  } catch (e) {
    dlog.d("[STORAGE] not able to delete data");
  }
}
