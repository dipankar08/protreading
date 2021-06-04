import moment from "moment";
import React, { useContext } from "react";
import { Alert } from "react-native";
import { CoreStateContext } from "../components/core/CoreContext";
import { TCallback } from "../components/core/core_model";
import { assertNotEmptyOrNotify, verifyOrCrash } from "../components/libs/assert";
import { dlog } from "../components/libs/dlog";
import { getRequest, postRequest } from "../components/libs/network";
import { saveString } from "../components/libs/stoarge";
import { getCurrentDate } from "../components/libs/time";
import { showNotification } from "../components/libs/uihelper";
import { AppStateContext, globalAppState, initialState, TDomain } from "./AppStateProvider";
import { PRO_TRADING_SERVER, SIMPLESTORE_ENDPOINT } from "./CONST";
import { processor } from "./helper/processor";
import { TMarketEntry, TObject } from "./model";

const SUMMARY_URL = `${PRO_TRADING_SERVER}/summary?`;
const MARKET_URL = `${PRO_TRADING_SERVER}/market?`;

function getDomainUrl(url: string) {
  return `${url}&domain=${globalAppState.domain}`;
}

let curDomain: TDomain = null;

export const useNetwork = () => {
  const appState = useContext(AppStateContext);
  const coreState = useContext(CoreStateContext);
  React.useEffect(() => {
    if (appState.state.domain != curDomain && appState.state.domain != null) {
      curDomain = appState.state.domain;
      refreshAllData({
        onBefore: () => showNotification("refreshing data"),
        onComplete: () => showNotification("refresh done"),
      });
    }
  }, [appState]);

  async function refreshAllData(callback: TCallback) {
    console.log(">>>>>>>>");
    processor.clear();
    callback.onBefore?.();
    await loadMarketData({
      onSuccess: async () => {
        await fetchUserInfo(callback);
      },
      onError: callback?.onError,
    });
  }

  async function fetchLatestClose(callback: TCallback) {
    callback.onBefore?.();
    try {
      let market = await getRequest(MARKET_URL);
      processor.setMarket(market.out);
      callback?.onComplete?.();
    } catch (err) {
      callback?.onError?.("Not able to fetch latest");
      callback?.onComplete?.();
    }
  }

  async function loadMarketData(callback?: TCallback) {
    dlog.d(`loadMarketData called ${appState.state.domain}`);
    callback?.onBefore?.();
    try {
      let market = await getRequest(getDomainUrl(MARKET_URL));
      processor.setMarket(market.out);
      appState.dispatch({
        type: "MERGE",
        payload: {
          sectorList: processor.sectorList,
          recommendedList: processor.recommendedList,
          stockMap: processor.stockMap,
        },
      });
      dlog.d(`[NETWORK] loadMarketData success ${globalAppState.domain} `);
      callback?.onSuccess?.({ msg: "updated data to latest" });
      callback?.onComplete?.();
    } catch (e) {
      dlog.e(`[NETWORK] loadMarketData failed ${SUMMARY_URL} - ${MARKET_URL}`);
      dlog.ex(e);
      callback?.onError?.("Error" + e.message);
      callback?.onComplete?.();
    }
  }

  // fetch the User info like position
  async function fetchUserInfo(callback?: TCallback) {
    dlog.d(`fetchUserInfo called`);
    if (coreState.state.authInfo == null) {
      dlog.e("fetchUserInfo: early return");
      return;
    }
    callback?.onBefore?.();
    try {
      let network_resp = await getRequest(
        `${SIMPLESTORE_ENDPOINT}/api/grodok_position?user_id=${coreState.state.authInfo?.user_id}&_limit=100&active=1`
      );
      verifyOrCrash(globalAppState.ltpMap != null, "Market is null");
      processor.setPositionData(network_resp.out);
      appState.dispatch({ type: "MERGE", payload: { position: processor.position } });
      callback?.onSuccess?.({});
      callback?.onComplete?.();
      dlog.d(`fetchUserInfo success`);
    } catch (e) {
      dlog.ex(e);
      callback?.onError?.("Error" + e.message);
      callback?.onComplete?.();
      dlog.d(`fetchUserInfo error`);
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
        active: "1",
      });
      await fetchUserInfo();
      showNotification("Created a new order");
      onSuccess?.();
    } catch (err) {
      dlog.ex(err);
      showNotification("Not able to create a order");
      onError?.("Error" + err.message);
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
      onError?.("Error" + err.message);
    }
  }

  async function deActivateOrder(id: string, onSuccess?: Function, onError?: Function) {
    if (!assertNotEmptyOrNotify(id)) {
      onError?.();
      return;
    }
    try {
      let response = await postRequest(`${SIMPLESTORE_ENDPOINT}/api/grodok_position/update`, {
        _id: id,
        active: "0",
      });
      await fetchUserInfo();
      showNotification("Order reactivated!");
      onSuccess?.();
    } catch (err) {
      dlog.d(err);
      showNotification("Not able to deactivate this order");
      onError?.("Error" + err.message);
    }
  }

  async function forceUpdateData(onSuccess?: Function, onError?: Function) {
    dlog.d("[NETWORK] forceUpdateData");
    try {
      let task1 = await getRequest(`${PRO_TRADING_SERVER}/snapshot?candle_type=1d&force=1`);
      let task2 = await getRequest(`${PRO_TRADING_SERVER}//snapshot?candle_type=5m&force=1`);
      dlog.d(`[NETWORK] forceUpdateData complete task1:${JSON.stringify(task1)}  task2:${JSON.stringify(task2)} `);
      showNotification("task submitted");
      if (onSuccess) {
        onSuccess();
      }
    } catch (e) {
      //setError("Not able to get Data");
      showNotification("Not able to submit task");
      dlog.d("[NETWORK] forceUpdateData failed ");
      dlog.ex(e);
      onError?.("Error" + e.message);
    }
  }

  async function performScreen(filter: string, callback: TCallback) {
    dlog.d("[NETWORK] performScreen");
    callback.onBefore?.();
    try {
      let result = await getRequest(getDomainUrl(`${PRO_TRADING_SERVER}/screen?filter=${filter.toLowerCase()}`));
      let resultJSON = result.out as Array<TMarketEntry>;

      callback.onSuccess?.(resultJSON);
    } catch (e) {
      callback.onError?.("Not able to performScreen" + e.message);
      dlog.ex(e);
    }
  }

  async function changeDomain(domain: TDomain, callback: TCallback) {
    dlog.d(`trying to chnage the domain:${domain}`);
    if (!domain) {
      return;
    }
    saveString("DOMAIN", domain);
    appState.dispatch({ type: "MERGE", payload: initialState });
    appState.dispatch({ type: "MERGE", payload: { domain: domain } });
  }

  async function clearAllData() {
    appState.dispatch({ type: "MERGE", payload: initialState });
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

  function isEmpty(s: string) {
    return s == undefined || s == null || s.trim().length == 0;
  }

  // screen
  async function saveNewScreen(data: TObject, callback: TCallback) {
    callback.onBefore?.();
    try {
      verifyOrCrash(!isEmpty(data.filter), "please enter filter");
      verifyOrCrash(!isEmpty(data.title), "please enter title");
      verifyOrCrash(!isEmpty(data.desc), "please enter desc");
      let response = await postRequest(`${SIMPLESTORE_ENDPOINT}/api/trading50_filter/insert`, data);
      callback.onSuccess?.(response.out);
    } catch (e) {
      callback.onError?.(e.message || "Not able to save");
    }
  }
  async function getScreen(callback: TCallback) {
    callback.onBefore?.();
    try {
      let response = await getRequest(`${SIMPLESTORE_ENDPOINT}/api/trading50_filter`);
      callback.onSuccess?.(response.out);
      callback.onComplete?.();
    } catch (e) {
      callback.onError?.(e.message || "No item found");
      callback.onComplete?.();
    }
  }

  async function recomputeIndicator(callback: TCallback) {
    dlog.d("[NETWORK] buildLatest");
    callback.onBefore?.();
    try {
      let result1 = await getRequest(getDomainUrl(`${PRO_TRADING_SERVER}/indicator?candle_type=5m&reload=1`));
      let result2 = await getRequest(getDomainUrl(`${PRO_TRADING_SERVER}/indicator?candle_type=1d&reload=1`));
      callback.onSuccess?.("Task Submitted");
      callback.onComplete?.();
    } catch (e) {
      callback.onError?.(e.message);
      callback.onComplete?.();
      dlog.ex(e);
    }
  }

  async function getTimeStamp(callback: TCallback) {
    dlog.d("[NETWORK] getTimeStamp");
    callback.onBefore?.();
    try {
      let result = await getRequest(getDomainUrl(`${PRO_TRADING_SERVER}/timestamp?`));
      for (const property in result.out.timestamp) {
        try {
          result.out.timestamp[property] = moment(result.out.timestamp[property]).fromNow();
        } catch {}
      }
      callback.onSuccess?.(result);
      callback.onComplete?.();
    } catch (e) {
      callback.onError?.(e.message);
      callback.onComplete?.();
      dlog.ex(e);
    }
  }

  return {
    fetchLatestClose,
    loadMarketData,
    fetchUserInfo,
    createOrder,
    closeOrder,
    forceUpdateData,
    reopenOrder,
    refreshAllData,
    changeDomain,
    performScreen,
    saveNewScreen,
    getScreen,
    recomputeIndicator,
    getTimeStamp,
    clearAllData,
    deActivateOrder: deActivateOrder,
  };
};

export const domainList = [
  { key: "UK", text: "UK" },
  { key: "IN", text: "INDIA" },
  { key: "USA", text: "USA" },
];
