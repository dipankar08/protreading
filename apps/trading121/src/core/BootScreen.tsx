// Splash screen or boot screen is important for loading the boot data.
import React from "react";
import { useContext, useEffect, useState } from "react";
import { STYLES } from "../components/styles";
import { CoreStateContext } from "./CoreContext";
import { useCoreApi } from "./useCoreApi";
import { DButton, DContainer, DContainerSafe, DLayoutCol, DText, ScreenHeader } from "../components/basic";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { DLoadingText, DTextFooter } from "../components/DText";
import { DAppLogo } from "../components/DImage";
import logo from "../../assets/images/icon_white.png";
import { CoreConstant } from "./constant";
import * as Updates from "expo-updates";

// In this screen we are trying to import { CACHE_KEY_MARKET } from '../appstate/CONST';
export const BootScreen = ({ navigation }: any) => {
  const coreState = useContext(CoreStateContext);
  const [update, setUpdate] = useState(false);
  const coreApi = useCoreApi();
  useEffect(() => {
    try {
      console.log(`Your Release channel is :${Updates.releaseChannel}, Update Id: ${Updates.updateId}`);
      Updates.checkForUpdateAsync().then((update) => {
        if (update.isAvailable) {
          setUpdate(true);
        }
      });
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
