import Toast from "react-native-root-toast";
export function showNotification(msg: string) {
  // if (Platform.OS == "android") Toast.show(msg, Toast.SHORT);
  let toast = Toast.show(msg, {
    duration: Toast.durations.LONG,
  });
}
