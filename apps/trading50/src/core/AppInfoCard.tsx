import React, { useContext, useEffect, useState } from "react";
import { Avatar } from "react-native-elements";
import { AppStateContext } from "../appstate/AppStateStore";
import { DContainerSafe, DLayoutCol, ScreenHeader, DButton, DLayoutRow } from "../components/basic";
import { useNetwork } from "../hooks/useNetwork";
import { dlog } from "../libs/dlog";
import { deleteData } from "../libs/stoarge";
import { TProps } from "../screens/types";
import { Image, Text, View, StyleSheet } from "react-native";
import { CoreStateContext } from "./CoreContext";
import { useCoreApi } from "./useCoreApi";
import { colors } from "../styles/colors";
import { DTextSubTitle } from "../components/DText";
import * as Application from "expo-application";
import { DKeyValueList } from "../components/DList";
import * as Updates from "expo-updates";
import { DButtonPrimary } from "../components/DButton";
import { showNotification } from "../libs/uihelper";

// Simple Logout card which should be embedit in the app
export const AppInfoCard = ({ navigation, route }: TProps) => {
  const coreState = useContext(CoreStateContext);
  const coreApi = useCoreApi();
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    /*
    Updates.checkForUpdateAsync().then((update) => {
      if (update.isAvailable) {
        // setUpdate(true);
      }
    });
    */
  }, []);
  async function doUpdate() {
    setLoading(true);
    try {
      let result = await Updates.fetchUpdateAsync();
      showNotification("Update done");
    } catch (err) {
      dlog.ex(err);
      showNotification("not able to updated");
    }
    setLoading(false);
  }
  //console.log(Updates);
  return (
    <DLayoutCol>
      <DLayoutCol style={{ alignContent: "center", alignItems: "center", width: "100%", backgroundColor: "#00000010", padding: 20, borderRadius: 4 }}>
        <DKeyValueList
          object={{
            Name: Application.applicationName,
            "Android Id": Application.applicationId,
            "native Version": Application.nativeApplicationVersion,
            "Release Channel": Updates.releaseChannel,
            "Update Id": Updates.updateId,
            Available: update ? "yes" : "No",
          }}
        ></DKeyValueList>
      </DLayoutCol>
      {
        <DButtonPrimary onPress={doUpdate} loading={loading}>
          Update the app
        </DButtonPrimary>
      }
    </DLayoutCol>
  );
};
