import axios from "axios";
import { dlog } from "./dlog";
import { TObject } from "./types";

export async function getRequest(url: string) {
  dlog.d("try fetching " + url);
  let response = await axios.get(url);
  const jsondata: any = response.data;
  if (jsondata.status == "success") {
    dlog.d("fetch success...");
    return jsondata;
  } else {
    dlog.d(`get failed. URL: ${url}..${JSON.stringify(response.data)}`);
    throw new Error(jsondata.msg);
  }
}

// No try catch here
export async function postRequest(url: string, data: TObject) {
  dlog.d(`[Network] posting url:${url}, data: ${JSON.stringify(data)}`);
  let response = await axios.post(url, data);
  const jsondata: any = response.data;
  if (jsondata.status == "success") {
    dlog.d("post success...");
    return jsondata;
  } else {
    dlog.d(`post failed for URL:${url}`);
    throw new Error(jsondata.msg);
  }
}