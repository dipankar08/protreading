import { showNotification } from "./uihelper";

export function verifyOrCrash(cond: boolean, msg = "Verify and crash called") {
  if (!cond) {
    throw new Error(msg);
  }
}

export function assertNotEmptyOrNotify(data: string) {
  if (data == null || data == undefined || data.length == 0) {
    showNotification("You must pass some valid data");
    return false;
  }
  return true;
}
