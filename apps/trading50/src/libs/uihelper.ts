import Toast from "react-native-simple-toast";
export function showNotification(msg: string) {
  Toast.show(msg, Toast.SHORT);
}
