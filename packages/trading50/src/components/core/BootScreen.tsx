// Splash screen or boot screen is important for loading the boot data.
import * as Updates from "expo-updates";
import React, { useContext, useEffect, useState } from "react";
import logo from "../../../assets/images/icon_white.png";
import { DAppLogo } from "../DImage";
import { DContainer, DLayoutCol } from "../DLayout";
import { DLoadingText, DTextFooter } from "../DText";
import { dlog } from "../libs/dlog";
import { STYLES } from "../styles";
import { CoreConstant } from "./constant";
import { CoreStateContext } from "./CoreContext";
import { useCoreApi } from "./useCoreApi";
import { isDev } from "./utils/utils";

// In this screen we are trying to import { CACHE_KEY_MARKET } from '../appstate/CONST';
export const BootScreen = ({ navigation }: any) => {
  const coreState = useContext(CoreStateContext);
  const [update, setUpdate] = useState(false);
  const coreApi = useCoreApi();
  useEffect(() => {
    try {
      if (!isDev()) {
        dlog.d(`Your Release channel is :${Updates.releaseChannel}, Update Id: ${Updates.updateId}`);
        Updates.checkForUpdateAsync().then((update) => {
          if (update.isAvailable) {
            setUpdate(true);
          }
        });
      }
    } catch (ee) {}
    coreApi.doAppBoot(() => {
      setTimeout(() => {
        coreApi.navigateNext(navigation);
      }, CoreConstant.BOOT_SCREEN_TIMEOUT);
    });
  }, []);

  return (
    <DContainer
      style={{
        backgroundColor: STYLES.APP_COLOR_PRIMARY,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40,
        flex: 1,
        flexDirection: "column",
      }}
    >
      <DLayoutCol>
        <DAppLogo logo={logo}></DAppLogo>
        <DLoadingText color="white" style={{ justifyContent: "flex-end", marginTop: 100 }}>
          Staring the app...
        </DLoadingText>
        <DTextFooter style={{ color: "white" }}> you are running {update ? "old build" : "latest build"}</DTextFooter>
      </DLayoutCol>
    </DContainer>
  );
};
