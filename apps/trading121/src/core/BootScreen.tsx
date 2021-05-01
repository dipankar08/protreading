// Splash screen or boot screen is important for loading the boot data.
import React from "react";
import { useContext, useEffect } from "react";
import { STYLES } from "../components/styles";
import { CoreStateContext } from "./CoreContext";
import { useCoreApi } from "./useCoreApi";
import { DButton, DContainer, DContainerSafe, DLayoutCol, DText, ScreenHeader } from "../components/basic";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { DLoadingText } from "../components/DText";
import { DAppLogo } from "../components/DImage";
import logo from "../../assets/images/icon_white.png";
import { DIMENS } from "../res/dimens";

// In this screen we are trying to import { CACHE_KEY_MARKET } from '../appstate/CONST';
export const BootScreen = ({ navigation }: any) => {
  const coreState = useContext(CoreStateContext);
  const coreApi = useCoreApi();
  useEffect(() => {
    coreApi.doAppBoot(() => {
      setTimeout(() => {
        coreApi.navigateNext("BOOT", navigation);
      }, 500);
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
        <DAppLogo logo={logo} size={80}></DAppLogo>
        <DLoadingText color="white" style={{ justifyContent: "flex-end", marginTop: 80 }}>
          Staring the app...
        </DLoadingText>
      </DLayoutCol>
    </DContainer>
  );
};
