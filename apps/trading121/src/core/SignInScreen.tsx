import React, { useState, useContext, useEffect } from "react";
import { AppStateContext } from "../appstate/AppStateStore";
import { DContainer, DText, DTextInput, DButton } from "../components/basic";
import { STYLES } from "../components/styles";
import { dlog } from "../libs/dlog";
import logo from "../../assets/images/icon_white.png";
import { getData, saveData } from "../libs/stoarge";
import { TProps } from "../screens/types";
import { Image, Text, View, StyleSheet, Alert } from "react-native";
import { CoreStateContext } from "./CoreContext";
import { useCoreApi } from "./useCoreApi";
import { DStatusBar } from "../components/DStatusBar";
import { STRINGS } from "../res/strings";
import { DTextFooter, DTextSubTitle, DTextTitle } from "../components/DText";
import { DButtonLink, DButtonWithIcon } from "../components/DButton";
import { colors } from "../styles/colors";
import { DIMENS } from "../res/dimens";
import { showNotification } from "../libs/uihelper";
import Constants from "expo-constants";
import _ from "underscore";
import { DPrompt } from "../components/DDialog";
// Sign in Logics
export const SignInScreen = ({ navigation }: TProps) => {
  const [email, setEmail] = useState("");
  const coreState = useContext(CoreStateContext);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingFacebook, setLoadingFacebook] = useState(false);
  const [loadingGuest, setLoadingGuest] = useState(false);
  const [visibleGuest, setVisibleGuest] = useState(false);
  const coreApi = useCoreApi();
  let name = "SignIn";
  //dlog.obj(Constants, "Expo Constants");
  useEffect(() => {
    dlog.d(`Mounted ${name}`);
    return () => {
      dlog.d(`Unmounted ${name}`);
    };
  }, []);

  return (
    <DContainer style={{ backgroundColor: STYLES.APP_COLOR_PRIMARY, justifyContent: "center", paddingHorizontal: 20 }}>
      <Image
        style={{
          width: 80,
          height: 80,
          backgroundColor: "transparent",
          alignSelf: "center",
          marginBottom: 0,
        }}
        source={logo}
      />
      <DTextTitle style={{ color: "white", textAlign: "center" }}>{STRINGS.APP_NAME}</DTextTitle>

      <DTextSubTitle style={{ color: "white", textAlign: "center", marginTop: 40 }}>Please login using your social account</DTextSubTitle>

      <DButtonWithIcon
        loading={loadingFacebook}
        icon="facebook"
        style={{ backgroundColor: colors.blue600, marginTop: DIMENS.GAP_4X }}
        onPress={() =>
          coreApi.FacebookSignIn({
            onSuccess() {
              dlog.d("facebook logic success");
              coreApi.navigateTo(navigation, "CompleteSignInScreen");
            },
            onBefore() {
              setLoadingFacebook(true);
            },
            onComplete() {
              setLoadingFacebook(false);
            },
            onError(msg: string) {
              showNotification(msg);
            },
          })
        }
      >
        Login as Facebook
      </DButtonWithIcon>
      <DButtonWithIcon
        loading={loadingGoogle}
        icon="google"
        style={{ backgroundColor: colors.red600 }}
        onPress={() =>
          coreApi.GoogleSignIn({
            onSuccess() {
              coreApi.navigateTo(navigation, "CompleteSignInScreen");
            },
            onBefore() {
              setLoadingGoogle(true);
            },
            onComplete() {
              setLoadingGoogle(false);
            },
            onError(msg: string) {
              showNotification(msg);
            },
          })
        }
      >
        Login as Google
      </DButtonWithIcon>
      <DButtonLink
        style={{
          marginTop: 10,
          textAlign: "center",
          width: "100%",
          justifyContent: "center",
          alignSelf: "center",
        }}
        onPress={() => {
          setVisibleGuest(true);
        }}
      >
        Login as Guest
      </DButtonLink>
      <DTextFooter style={{ color: "white", textAlign: "center" }}>
        (You can use your google and facebook account to get signin. You can login using anyone of this if they have same email address. )
      </DTextFooter>
      <DPrompt
        visible={visibleGuest}
        placeholder="email"
        title={"Login as Guest"}
        body={"Please enter you email address"}
        onOk={(text: string) => {
          setVisibleGuest(false);
          if (text.trim().length == 0) {
            showNotification("Please enter username");
            return;
          }
          coreApi.loginAsGuest(text, {
            onSuccess: () => {
              coreApi.navigateTo(navigation, "CompleteSignInScreen");
            },
          });
        }}
        onCancel={() => setVisibleGuest(false)}
      ></DPrompt>
    </DContainer>
  );
};
