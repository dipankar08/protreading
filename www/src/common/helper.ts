import Cookies from "js-cookie";

/// COOKIE OPERATION
export function setCookie(key: string, value: any, type: "str" | "json" = "str") {
  if (type == "json") {
    value = `${JSON.stringify(value)}`;
  }
  Cookies.set(key, value);
}
export function getCookie(key: string, type: "str" | "json" = "str") {
  let val = Cookies.get(key);
  if (!val) {
    return null;
  }
  if (type == "json") {
    return JSON.parse(val);
  } else {
    return val;
  }
}
export function deleteCookie(key: string) {
  return Cookies.remove(key);
}
