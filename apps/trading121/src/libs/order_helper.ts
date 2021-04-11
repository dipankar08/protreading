import axios from "axios";
import React from "react";
import { Alert } from "react-native";
import Toast from "react-native-simple-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";

type TInvestmentSummary = {
  invested_amount: number;
  current_amount: number;
  change_amount: number;
  change_per: number;
};

type TOrder = {
  _id: string;
  symbol: string;
  buy_price: number;
  sell_price: number;
  last_price: number;
  buy_ts: any;
  sell_ts: any;
  quantities: number;
  is_open: boolean;
  is_gain: boolean;
  open_for: string;
  invested_sum: number;
  change: number;
  change_per: number;
  gross: number;
};

export const userOrder = () => {
  const [orderList, setOrderList] = React.useState<TOrder[]>([]);
  const [orderSummary, setOrderSummary] = React.useState<TInvestmentSummary>();
  const [loading, setLoading] = React.useState(false);
  const [newStock, setNewStock] = React.useState({
    symbol: "",
    buy_price: "",
    quantities: "",
    sell_price: null,
  });

  function processOrder(obj: any) {
    console.log("processing order...");
    //console.log(obj);
    let result: Array<TOrder> = [];
    let invested_amount_total = 0;
    let current_amount_total = 0;

    for (var x of obj) {
      let latest = 120; //x.latest;
      let open_for = "4 days";
      let is_open = x.sell_price == null;
      let invested_amount = x.buy_price * x.quantities;
      let current_amount = latest * x.quantities;
      let change = (x.last_price = x.buy_price);
      let change_per = ((x.last_price - x.buy_price) * 100) / x.buy_price;
      let gross = (x.last_price - x.buy_price) * x.quantities;
      result.push({
        _id: x._id,
        symbol: x.symbol,
        buy_price: x.buy_price,
        sell_price: x.sell_price || null,
        last_price: 0, // todo
        buy_ts: x.buy_ts,
        sell_ts: x.sell_ts || null,
        quantities: x.quantities,
        is_open: x.sell_price == null,
        is_gain: x.buy_price > latest,
        open_for: open_for,
        invested_sum: invested_amount,
        change: change,
        change_per: change_per,
        gross: gross,
      });
      if (is_open) {
        invested_amount_total += invested_amount;
        current_amount_total += current_amount_total;
      }
    }
    result.sort((a, b) => (a.is_open ? -1 : 1));
    setOrderList(result);
    setOrderSummary({
      change_amount: current_amount_total - invested_amount_total,
      current_amount: current_amount_total,
      invested_amount: invested_amount_total,
      change_per: (current_amount_total - invested_amount_total) / invested_amount_total,
    });
    console.log("processing completed and updated the result.");
  }

  async function fetchOrder() {
    // check cache
    try {
      const value = await AsyncStorage.getItem("ORDER_SUMMARY");
      if (value !== null) {
        console.log("got it from cache...");
        processOrder(JSON.parse(value));
      } else {
        await loadFromNetwork();
      }
    } catch (e) {
      await loadFromNetwork();
    }
  }

  async function loadFromNetwork() {
    console.log("fetching position from network... ");
    try {
      let response = await axios.get("https://simplestore.dipankar.co.in/api/grodok_position");
      //console.log(response.data);
      const jsondata: any = response.data;
      if (jsondata.status == "success" && jsondata.out.length > 0) {
        let data = response.data.out;
        try {
          await AsyncStorage.setItem("ORDER_SUMMARY", JSON.stringify(data));
          console.log("data saved in cache");
        } catch (e) {
          console.log("Not able to store data in the cache");
        }
        processOrder(data);
        Toast.show("retrieved  market summary", Toast.SHORT);
      } else {
        Toast.show("Failed to fetch the order", Toast.SHORT);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      Toast.show("Internal error while fetching the order", Toast.SHORT);
    }
  }

  async function createOrder() {
    console.log("creating new order... ");
    try {
      let response = await axios.post("https://simplestore.dipankar.co.in/api/grodok_position/create", {
        symbol: newStock.symbol,
        buy_price: parseInt(newStock.buy_price),
        quantities: parseInt(newStock.quantities),
      });
      console.log(response);
      const jsondata: any = response.data;
      if (jsondata.status == "success" && jsondata.out.length > 0) {
        //setOrderList(processOrder(response.data));
        Toast.show("new order created", Toast.SHORT);
        loadFromNetwork();
      } else {
        Toast.show("Not able to create order", Toast.SHORT);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      false;
      Toast.show("Not able to create order", Toast.SHORT);
    }
  }

  function closeOrder(id: string, close_price: string) {
    Alert.alert("Close this order", "Did you sell this stock?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          // close this order
          try {
            let response = await axios.post("https://simplestore.dipankar.co.in/api/grodok_position/update", {
              id: id,
              sell_price: parseInt(close_price),
            });
            if (response.data.status == "success") {
              Toast.show("Position Closed", Toast.SHORT);
              loadFromNetwork();
            } else {
              Toast.show("Not able to close the position", Toast.SHORT);
            }
          } catch (e) {
            Toast.show("Not able to close the position", Toast.SHORT);
          }
        },
      },
    ]);
  }

  const reloadOrder = () => {
    loadFromNetwork();
  };

  React.useEffect(() => {
    fetchOrder();
  }, []);

  return { orderList, loading, reloadOrder, newStock, createOrder, setNewStock, orderSummary, closeOrder };
};
