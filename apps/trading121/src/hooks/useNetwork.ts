import React from "react";
import { useContext } from "react";
import { AppStateContext } from "../appstate/AppStateStore";
import { PRO_TRADING_SERVER, CACHE_KEY_SUMMARY, CACHE_KEY_MARKET, CACHE_KEY_POSITION, SIMPLESTORE_ENDPOINT } from "../appstate/CONST";
import { verifyOrCrash } from "../libs/assert";
import { dlog } from "../libs/dlog";
import { getRequest, postRequest } from "../libs/network";
import { showNotification } from "../libs/uihelper";
import { processSummaryData, processMarketData, processPositionData } from "../models/processor";

export const useNetwork = () => {
  const appState = useContext(AppStateContext);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

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
        `${SIMPLESTORE_ENDPOINT}/api/grodok_position?user_id=${appState.state.userInfo.user_id}&_limit=100`,
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
    try {
      let response = await postRequest(`${SIMPLESTORE_ENDPOINT}/api/grodok_position/create`, {
        user_id: appState.state.userInfo.user_id,
        symbol: stock,
        buy_price: parseFloat(price),
        quantities: parseFloat(quantities),
      });
      await fetchUserInfo();
      showNotification("Created a new order");
    } catch (err) {
      dlog.d(err);
      showNotification("Not able to create a order");
    }
  }

  return { loading, error, reLoadAllData, fetchUserInfo, createOrder };
};
