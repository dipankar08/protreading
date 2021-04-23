import { Alert } from "react-native";
import * as Updates from "expo-updates";
import { useEffect } from "react";

const otaUpdates = async () => {
  try {
    const update = await Updates.checkForUpdateAsync();

    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();

      Alert.alert("Update is available", "Do you want to install it?", [
        {
          text: "Later",
          style: "cancel",
        },
        {
          text: "Install",
          style: "destructive",
          onPress: Updates.reloadAsync,
        },
      ]);
    }
  } catch (err) {
    console.log(err); // TODO
  }
};

export const useUpdates = () => {
  useEffect(() => {
    otaUpdates();
  }, []);
};
