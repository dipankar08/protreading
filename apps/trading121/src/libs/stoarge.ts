import AsyncStorage from "@react-native-community/async-storage";
import { TObject } from "../models/model";
import { dlog } from "./dlog";
export async function saveData(key: string, value: TObject) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    dlog.d("[STORAGE] latest data  saved in cache");
  } catch (e) {
    dlog.d("[STORAGE] Not able to store latest data in the cache");
  }
}

export async function getData(key: string) {
  try {
    let data = await AsyncStorage.getItem(key);
    if (data) {
      dlog.d("[STORAGE] loaded data");
      return JSON.parse(data);
    } else {
      return null;
    }
  } catch (e) {
    dlog.d(e);
    return null;
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
