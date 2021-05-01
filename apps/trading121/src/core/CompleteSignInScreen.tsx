import React, { useContext, useEffect } from "react";
import { DContainer, DText, DButton, DLayoutCol } from "../components/basic";
import { dlog } from "../libs/dlog";
import { TProps } from "../screens/types";
import { CoreStateContext } from "./CoreContext";
import { useCoreApi } from "./useCoreApi";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/colors";
import { STYLES } from "../components/styles";
import { DAppLogo } from "../components/DImage";
import { DLoadingText } from "../components/DText";
import logo from "../../assets/images/icon_white.png";

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
      <DLayoutCol>
        <DAppLogo logo={logo} size={80}></DAppLogo>
        <DLoadingText color="white" style={{ justifyContent: "flex-end", marginTop: 80 }}>
          Log you in....
        </DLoadingText>
      </DLayoutCol>
    </DContainer>
  );
};
