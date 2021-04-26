import React from "react";
import { useContext } from "react";
import { Alert } from "react-native";
import { AppStateContext } from "../appstate/AppStateStore";
import { PRO_TRADING_SERVER, CACHE_KEY_SUMMARY, CACHE_KEY_MARKET, CACHE_KEY_POSITION, SIMPLESTORE_ENDPOINT } from "../appstate/CONST";
import { assertNotEmptyOrNotify, verifyOrCrash } from "../libs/assert";
import { dlog } from "../libs/dlog";
import { getRequest, postRequest } from "../libs/network";
import { showNotification } from "../libs/uihelper";
import { processSummaryData, processMarketData, processPositionData } from "../models/processor";
import { getCurrentDate } from "../libs/time";
import { CoreStateContext } from "../core/CoreContext";

export const useNetwork = () => {
  const appState = useContext(AppStateContext);
  const coreState = useContext(CoreStateContext);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  async function doAllNetworkCallOnBoot() {
    await reLoadAllData();
    await fetchUserInfo();
  }

  // realod all market Data
  async function reLoadAllData(onSuccess?: Function, onError?: Function) {
    dlog.d("[NETWORK] fetching from network ");
    setLoading(true);
    try {
      let summary = await getRequest(`${PRO_TRADING_SERVER}/summary`, CACHE_KEY_SUMMARY, false);
      let market = await getRequest(`${PRO_TRADING_SERVER}/latest?candle_type_5m`, CACHE_KEY_MARKET, false);
      appState.dispatch({ type: "UPDATE_SUMMARY", payload: processSummaryData(summary) });
      appState.dispatch({ type: "UPDATE_MARKET", payload: processMarketData(market) });
      setLoading(false);
      dlog.d("[NETWORK] fetching from network complete ");
      if (onSuccess) {
        onSuccess();
      }
    } catch (e) {
      //setError("Not able to get Data");
      setLoading(false);
      dlog.d("[NETWORK] fetching from network failed ");
      dlog.ex(e);
      if (onError) {
        onError();
      }
    }
  }

  // fetch the User info like position
  async function fetchUserInfo(onSuccess?: Function, onError?: Function) {
    if (!appState.state.isLoggedIn) {
      return;
    }
    try {
      let position = await getRequest(
        `${SIMPLESTORE_ENDPOINT}/api/grodok_position?user_id=${coreState.state.authInfo?.user_id}&_limit=100`,
        CACHE_KEY_POSITION,
        false
      );
      verifyOrCrash(appState.state.market != null);
      appState.dispatch({ type: "UPDATE_POSITION", payload: processPositionData(position, appState.state.market) });
      setLoading(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (e) {
      setLoading(false);
      setError("Not able to get Data");
      if (onError) {
        onError();
      }
    }
  }

  async function createOrder(stock: string, price: string, quantities: string, onSuccess?: Function, onError?: Function) {
    if (!(assertNotEmptyOrNotify(stock) && assertNotEmptyOrNotify(price) && assertNotEmptyOrNotify(quantities))) {
      onError?.();
      return;
    }
    try {
      let response = await postRequest(`${SIMPLESTORE_ENDPOINT}/api/grodok_position/create`, {
        user_id: coreState.state.authInfo?.user_id,
        symbol: stock,
        buy_price: parseFloat(price),
        quantities: parseFloat(quantities),
        buy_ts: getCurrentDate(),
      });
      await fetchUserInfo();
      showNotification("Created a new order");
      onSuccess?.();
    } catch (err) {
      dlog.d(err);
      showNotification("Not able to create a order");
      onError?.();
    }
  }

  async function closeOrder(id: string, price: string, onSuccess?: Function, onError?: Function) {
    if (!(assertNotEmptyOrNotify(id) && assertNotEmptyOrNotify(price))) {
      onError?.();
      return;
    }
    try {
      let response = await postRequest(`${SIMPLESTORE_ENDPOINT}/api/grodok_position/update`, {
        _id: id,
        sell_price: parseFloat(price),
        is_sold: true,
        sell_ts: getCurrentDate(),
      });
      await fetchUserInfo();
      showNotification("Order is closed");
      onSuccess?.();
    } catch (err) {
      dlog.d(err);
      showNotification("Not able to close this order");
      onError?.();
    }
  }

  async function forceUpdateData(onSuccess?: Function, onError?: Function) {
    dlog.d("[NETWORK] forceUpdateData");
    setLoading(true);
    try {
      let task1 = await getRequest(`${PRO_TRADING_SERVER}/snapshot?candle_type=1d&force=1`, null, false);
      let task2 = await getRequest(`${PRO_TRADING_SERVER}//snapshot?candle_type=5m&force=1`, null, false);
      setLoading(false);
      dlog.d(`[NETWORK] forceUpdateData complete task1:${JSON.stringify(task1)}  task2:${JSON.stringify(task2)} `);
      showNotification("task submitted");
      if (onSuccess) {
        onSuccess();
      }
    } catch (e) {
      //setError("Not able to get Data");
      setLoading(false);
      showNotification("Not able to submit task");
      dlog.d("[NETWORK] forceUpdateData failed ");
      dlog.ex(e);
      if (onError) {
        onError();
      }
    }
  }

  async function reopenOrder(id: string) {
    async function reopen(id: string) {
      let response = await postRequest(`${SIMPLESTORE_ENDPOINT}/api/grodok_position/update`, {
        _id: id,
        sell_price: 0,
        is_sold: true,
      });
      await fetchUserInfo();
      showNotification("Order is closed");
    }
    Alert.alert("Re-Open Order?", "Do you want to reopen this order?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          console.log("OK Pressed");
          reopen(id);
        },
      },
    ]);
  }

  return { loading, error, reLoadAllData, fetchUserInfo, createOrder, closeOrder, forceUpdateData, reopenOrder, doAllNetworkCallOnBoot };
};
