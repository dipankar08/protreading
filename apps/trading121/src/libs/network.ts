import axios from "axios";

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
