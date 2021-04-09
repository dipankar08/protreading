import { localEvent } from "./localEvent";
import { GetOnSimpleStore, PostOnSimpleStore } from "./network";
import { TArray, TObject } from "./types";

export function simple_store_create(dbname: string, data: TObject, process?: any) {
  localEvent.notify("quick_notification", { status: "success", msg: "Creating data...." });
  PostOnSimpleStore(
    `https://simplestore.dipankar.co.in/api/${dbname}/create`,
    data,
    function(data) {
      let res = (data as TArray)[0];
      if (process) {
        process(res);
      }
      localEvent.notify(`${dbname}_create_success`, res);
      localEvent.notify("quick_notification", { status: "success", msg: "Create Success!" });
    },
    function(err) {
      console.log(err);
      localEvent.notify("quick_notification", { status: "error", msg: "Create Error!" });
      localEvent.notify(`${dbname}_create_error`, {
        title: "Not able to create",
        subtitle: err,
      });
    }
  );
}

export function simple_store_get(dbname: string, id: string, process: any) {
  localEvent.notify("quick_notification", { status: "success", msg: "Fetching information..." });
  GetOnSimpleStore(
    `https://simplestore.dipankar.co.in/api/${dbname}/?id=${id}`,
    function(data) {
      if ((data as TArray).length == 0) {
        localEvent.notify(`${dbname}_get_error`, {
          title: "No item found",
          subtitle: "No item found for this ID",
        });
        return;
      }
      let entry = (data as TArray)[0] as TObject;
      try {
        if (process) {
          process(entry);
        }
        localEvent.notify(`${dbname}_get_success`, entry);
        localEvent.notify("quick_notification", { status: "success", msg: "fetch Success!" });
      } catch (err) {
        console.log(`Exception: ${err.message}`);
        localEvent.notify(`${dbname}_get_error`, {
          title: "Permission Error happens",
          subtitle: err.message,
        });
        return;
      }
    },
    function(err) {
      console.log(err);
      localEvent.notify(`${dbname}_get_error`, {
        title: "Not able to get item",
        subtitle: err,
      });
      localEvent.notify("quick_notification", { status: "error", msg: "Fetch Error!" });
    }
  );
}

export function simple_store_search(dbname: string, query: TObject, process?: any, notification_tag?: string) {
  localEvent.notify("quick_notification", { status: "success", msg: "Searching information..." });
  let qStr = "";
  for (const [key, value] of Object.entries(query)) {
    if (value) {
      qStr += `&${key}=${value}`;
    }
  }
  GetOnSimpleStore(
    `https://simplestore.dipankar.co.in/api/${dbname}?${qStr}&_limit=20`,
    function(data) {
      try {
        if (process) {
          for (var d of data as TArray) {
            process(d);
          }
        }
      } catch (err) {
        console.log(`Exception: ${err.message}`);
        localEvent.notify(notification_tag ? notification_tag + "_error" : `${dbname}_search_error`, {
          title: "Not able to search item",
          subtitle: err.message,
        });
      }
      localEvent.notify("quick_notification", { status: "success", msg: "Search Success!" });
      localEvent.notify(notification_tag ? notification_tag + "_error" : `${dbname}_search_success`, data);
    },
    function(err) {
      console.log(err);
      localEvent.notify(notification_tag ? notification_tag + "_error" : `${dbname}_search_error`, {
        title: "Not able to search item",
        subtitle: err,
      });
      localEvent.notify("quick_notification", { status: "error", msg: "Search Error!" });
    }
  );
}

export function simple_store_update(dbname: string, id: string, data: TObject) {
  localEvent.notify("quick_notification", { status: "success", msg: "Updating information..." });
  data._id = id;
  PostOnSimpleStore(
    `https://simplestore.dipankar.co.in/api/${dbname}/update`,
    data,
    function(data) {
      localEvent.notify(`${dbname}_update_success`, data);
      localEvent.notify("quick_notification", { status: "success", msg: "Update Done!" });
    },
    function(err) {
      console.log(err);
      localEvent.notify(`${dbname}_update_error`, {
        title: "Not able to update",
        subtitle: err,
      });
      localEvent.notify("quick_notification", { status: "error", msg: "Update Error!" });
    }
  );
}
export function simple_store_subentry_add(dbname: string, id: string, key: string, value: TObject) {
  localEvent.notify("quick_notification", { status: "success", msg: "Updating information..." });
  PostOnSimpleStore(
    `https://simplestore.dipankar.co.in/api/${dbname}/subentry/add`,
    { id: id, key: key, value: value },
    function(data) {
      localEvent.notify(`${dbname}_subentry_add_success`, data);
      localEvent.notify("quick_notification", { status: "success", msg: "Update Done!" });
    },
    function(err) {
      console.log(err);
      localEvent.notify(`${dbname}_subentry_add_error`, {
        title: "Not able to update",
        subtitle: err,
      });
      localEvent.notify("quick_notification", { status: "error", msg: "Update Error!" });
    }
  );
}
