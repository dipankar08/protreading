import AsyncStorage from "@react-native-community/async-storage";
import { TObject } from "../models/model";
export async function saveData(key: string, value: TObject) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    console.log("[STORAGE] latest data  saved in cache");
  } catch (e) {
    console.log("[STORAGE] Not able to store latest data in the cache");
  }
}

export async function getData(key: string) {
  try {
    let data = await AsyncStorage.getItem(key);
    if (data) {
      console.log("[STORAGE] loaded data");
      return JSON.parse(data);
    } else {
      return null;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function deleteData(key: string) {
  try {
    await AsyncStorage.setItem(key, "");
    console.log("[STORAGE] Delete data ");
  } catch (e) {
    console.log("[STORAGE] not able to delete data");
  }
}
