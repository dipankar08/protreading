import React from "react";
import { useContext } from "react";
import { Alert } from "react-native";
import { AppStateContext } from "../appstate/AppStateStore";
import { PRO_TRADING_SERVER, CACHE_KEY_SUMMARY, CACHE_KEY_MARKET, CACHE_KEY_POSITION, SIMPLESTORE_ENDPOINT } from "../appstate/CONST";
import { assertNotEmptyOrNotify, verifyOrCrash } from "../libs/assert";
import { dlog } from "../libs/dlog";
import { getRequest, postRequest } from "../libs/network";
import { showNotification } from "../libs/uihelper";
import { processor } from "../models/processor";
import { getCurrentDate } from "../libs/time";
import { CoreStateContext } from "../core/CoreContext";
import { TCallback } from "../core/core_model";
import { globalAppState } from "../appstate/AppStateReducer";
import { initialState, TDomain } from "../appstate/types";

const SUMMARY_URL = `${PRO_TRADING_SERVER}/summary?`;
const LATEST_URL = `${PRO_TRADING_SERVER}/latest?candle_type=5m`;
const MARKET_URL = `${PRO_TRADING_SERVER}/market?`;

function getDomainUrl(url: string) {
  return `${url}&domain=${globalAppState.domain}`;
}

export const useNetwork = () => {
  const appState = useContext(AppStateContext);
  const coreState = useContext(CoreStateContext);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  async function doAllNetworkCallOnBoot(callback: TCallback) {
    callback.onBefore?.();
    await reLoadAllData();
    await fetchUserInfo(callback);
  }

  async function fetchLatestClose(callback: TCallback) {
    callback.onBefore?.();
    try {
      let market = await getRequest(MARKET_URL, CACHE_KEY_MARKET, false);
      processor.setMarket(market);
      callback?.onComplete?.();
    } catch (err) {
      callback?.onError?.("Not able to fetch latest");
      callback?.onComplete?.();
    }
  }

  // realod all market Data
  async function reLoadAllData(callback?: TCallback) {
    dlog.d("[NETWORK] fetching from network ");
    callback?.onBefore?.();
    try {
      let summary = await getRequest(getDomainUrl(SUMMARY_URL), CACHE_KEY_SUMMARY, false);
      let latest = await getRequest(getDomainUrl(LATEST_URL), CACHE_KEY_MARKET, false);
      let market = await getRequest(getDomainUrl(MARKET_URL), CACHE_KEY_MARKET, false);

      // process alll data
      processor.setSummary(summary);
      processor.setMarket(market);
      processor.setLatestIndicator(latest);

      appState.dispatch({
        type: "MERGE",
        payload: {
          summary: processor.summary,
          sectorList: processor.sectorList,
          recommendedList: processor.recommendedList,
        },
      });
      dlog.d("[NETWORK] fetching from network complete ");
      callback?.onSuccess?.({});
      callback?.onComplete?.();
    } catch (e) {
      dlog.d(`[NETWORK] fetching from network failed ${SUMMARY_URL} - ${LATEST_URL}`);
      dlog.ex(e);
      callback?.onError?.("Not able to ralod data");
      callback?.onComplete?.();
    }
  }

  // fetch the User info like position
  async function fetchUserInfo(callback?: TCallback) {
    if (coreState.state.authInfo == null) {
      dlog.d("early return");
      return;
    }
    callback?.onBefore?.();
    try {
      let network_resp = await getRequest(
        `${SIMPLESTORE_ENDPOINT}/api/grodok_position?user_id=${coreState.state.authInfo?.user_id}&_limit=100`,
        CACHE_KEY_POSITION,
        false
      );
      verifyOrCrash(globalAppState.ltpMap != null, "Market is null");
      processor.setPositionData(network_resp);
      appState.dispatch({ type: "MERGE", payload: { position: processor.position } });
      setLoading(false);
      callback?.onSuccess?.({});
      callback?.onComplete?.();
    } catch (e) {
      dlog.ex(e);
      setLoading(false);
      setError("Not able to get Data");
      callback?.onError?.("Not able to get data");
      callback?.onComplete?.();
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
      dlog.ex(err);
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

  async function changeDomain(domain: TDomain) {
    appState.dispatch({ type: "MERGE", payload: initialState });
    globalAppState.domain = domain;
    reLoadAllData();
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

  return {
    loading,
    error,
    fetchLatestClose,
    reLoadAllData,
    fetchUserInfo,
    createOrder,
    closeOrder,
    forceUpdateData,
    reopenOrder,
    doAllNetworkCallOnBoot,
    changeDomain,
  };
};
