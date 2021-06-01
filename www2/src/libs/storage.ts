import Cookies from "universal-cookie";
import { dlog } from "./dlog";
import { TObject } from "./types";
const cookies = new Cookies();

export function storeObj(key: string, value: TObject) {
  dlog.d(`storeObj ${key}`);
  cookies.set(key, JSON.stringify(value));
}

export function getObj(key: string): TObject | undefined {
  dlog.d(`getObj ${key}`);
  try {
    let data = cookies.get(key, undefined);
    if (data instanceof Object) {
      return data;
    }
    if (!data) {
      return undefined;
    }
    return JSON.parse(data);
  } catch (err) {
    return undefined;
  }
}

export function deleteObj(key: string) {
  dlog.d(`deleteObj  ${key}`);
  cookies.remove(key);
}
