import React, { useContext, useEffect } from "react";
import { DContainer, DText, DButton } from "../components/basic";
import { dlog } from "../libs/dlog";
import { TProps } from "../screens/types";
import { CoreStateContext } from "./CoreContext";
import { useCoreApi } from "./useCoreApi";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/colors";
import { STYLES } from "../components/styles";

// Sign up logic...
export const CompleteSignInScreen = ({ navigation }: TProps) => {
  const coreState = useContext(CoreStateContext);
  const coreApi = useCoreApi();
  useEffect(() => {
    coreApi.doCompleteSignIn(() => {
      setTimeout(() => {
        coreApi.navigateNext("SIGN_IN_COMPLETE", navigation);
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
      <Text style={{ color: colors.white, marginTop: 10, textAlign: "center" }}>(getting login sessions)</Text>
    </DContainer>
  );
};
