import TimeAgo from "javascript-time-ago";
//import en from "javascript-time-ago/locale/en";

//TimeAgo.addDefaultLocale(en);

// Create formatter (English).
//const timeAgo = new TimeAgo();
export function getCurrentDate() {
  return new Date().toISOString();
}

export function getDataFromString(str: string) {
  new Date(str);
}

export function getAgoString(str: string) {
  try {
    //return timeAgo.format(new Date(str));
  } catch (ee) {
    return "sometime";
  }
}

export function getFormattedDate(str: string) {
  let d = new Date(str);
  return d.toLocaleString();
}
