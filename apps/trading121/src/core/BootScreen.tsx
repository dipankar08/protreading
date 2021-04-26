// Splash screen or boot screen is important for loading the boot data.
import React from "react";
import { useContext, useEffect } from "react";
import { STYLES } from "../components/styles";
import { CoreStateContext } from "./CoreContext";
import { useCoreApi } from "./useCoreApi";
import { DButton, DContainer, DContainerSafe, DLayoutCol, DText, ScreenHeader } from "../components/basic";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/colors";

// In this screen we are trying to import { CACHE_KEY_MARKET } from '../appstate/CONST';
export const BootScreen = ({ navigation }: any) => {
  const coreState = useContext(CoreStateContext);
  const coreApi = useCoreApi();
  useEffect(() => {
    coreApi.doAppBoot(() => {
      setTimeout(() => {
        coreApi.navigateNext("BOOT", navigation);
      }, 1000);
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
      <ActivityIndicator size="small" color="white" />
      <Text style={{ color: "white", marginTop: 14, textAlign: "center", fontWeight: "bold" }}>Loading....</Text>
      <Text style={{ color: colors.white, marginTop: 10, textAlign: "center" }}>(Trying to load boot config)</Text>
    </DContainer>
  );
};
