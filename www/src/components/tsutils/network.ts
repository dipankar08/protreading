import axios from "axios";
import _ from "underscore";
import { TOnError, TOnSuccess } from "./types";

export function getAndForget(url: string) {
  axios
    .get(url)
    .then((resp) => {
      console.log(resp);
    })
    .catch((err) => {
      console.log(err);
    });
}

export function postAndForget(url: string, data: any) {
  axios
    .post(url, JSON.stringify(data))
    .then((resp) => {
      console.log(resp);
    })
    .catch((err) => {
      console.log(err);
    });
}
export function GetOnSimpleStore(url: string, onSuccess?: TOnSuccess, onError?: TOnError) {
  axios
    .get(url)
    .then((response) => {
      if (_.isString(response.data)) {
        response.data = JSON.parse(response.data);
      }
      if (response.data.status == "success") {
        if (onSuccess) onSuccess(response.data.out, response.data);
      } else {
        if (onError) {
          onError(response.data.msg, response.data);
        }
      }
    })
    .catch((err) => {
      if (onError) {
        onError("No network or problem while rendering", { status: "error", msg: "Network error!" });
      }
      console.log(err);
    });
}

export function PostOnSimpleStore(url: string, data: any, onSuccess?: TOnSuccess, onError?: TOnError) {
  axios
    .post(url, JSON.stringify(data))
    .then((response) => {
      if (_.isString(response.data)) {
        response.data = JSON.parse(response.data);
      }
      if (response.data.status == "success") {
        if (onSuccess) onSuccess(response.data.out, response.data);
      } else {
        if (onError) {
          onError(response.data.msg, response.data);
        }
      }
    })
    .catch((err) => {
      if (onError) {
        onError("No network or problem while rendering");
      }
      console.log(err);
    });
}
