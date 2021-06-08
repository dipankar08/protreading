import * as Application from "expo-application";
import * as Updates from "expo-updates";
import React, { useContext, useEffect, useState } from "react";
import { TProps } from "../../screens/types";
import { DButtonPrimary } from "../DButton";
import { DLayoutCol } from "../DLayout";
import { DKeyValueList } from "../DList";
import { dlog } from "../libs/dlog";
import { showNotification } from "../libs/uihelper";
import { CoreStateContext } from "./CoreContext";
import { useCoreApi } from "./useCoreApi";
import { isDev } from "./utils/utils";

// Simple Logout card which should be embedit in the app
export const AppInfoCard = ({ navigation, route }: TProps) => {
  const coreState = useContext(CoreStateContext);
  const coreApi = useCoreApi();
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!isDev()) {
      Updates.checkForUpdateAsync().then((update) => {
        if (update.isAvailable) {
          setUpdate(true);
        }
      });
    }
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
  return (
    <DLayoutCol>
      <DLayoutCol>
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
