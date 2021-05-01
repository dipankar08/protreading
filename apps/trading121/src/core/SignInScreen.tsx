import React, { useState, useContext, useEffect } from "react";
import { AppStateContext } from "../appstate/AppStateStore";
import { DContainer, DText, DTextInput, DButton } from "../components/basic";
import { STYLES } from "../components/styles";
import { dlog } from "../libs/dlog";
import logo from "../../assets/images/icon_white.png";
import { getData, saveData } from "../libs/stoarge";
import { TProps } from "../screens/types";
import { Image, Text, View, StyleSheet } from "react-native";
import { CoreStateContext } from "./CoreContext";
import { useCoreApi } from "./useCoreApi";
import { DStatusBar } from "../components/DStatusBar";
import { STRINGS } from "../res/strings";
import { DTextFooter, DTextSubTitle, DTextTitle } from "../components/DText";
import { DButtonWithIcon } from "../components/DButton";
import { colors } from "../styles/colors";
import { DIMENS } from "../res/dimens";
import { showNotification } from "../libs/uihelper";
// Sign in Logics
export const SignInScreen = ({ navigation }: TProps) => {
  const [email, setEmail] = useState("");
  const coreState = useContext(CoreStateContext);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingFacebook, setLoadingFacebook] = useState(false);
  const coreApi = useCoreApi();
  let name = "SignIn";
  useEffect(() => {
    dlog.d(`Mounted ${name}`);
    return () => {
      dlog.d(`Unmounted ${name}`);
    };
  }, []);

  function signIn() {
    let userInfo = { name: "Guest", email: email.toLocaleLowerCase().trim(), user_id: email.toLocaleLowerCase().trim() };
    coreApi.doSignIn(userInfo, () => {
      coreApi.navigateNext("SIGN_IN", navigation);
    });
  }
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
              coreApi.navigateTo(navigation, "CompleteSignInScreen");
              setTimeout(() => coreApi.navigateNext("SIGN_IN", navigation), 10);
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
              setTimeout(() => coreApi.navigateNext("SIGN_IN", navigation), 10);
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
      <DTextFooter style={{ color: "white", textAlign: "center" }}>
        (You can use your google and facebook account to get signin. You can login using anyone of this if they have same email address. )
      </DTextFooter>
    </DContainer>
  );
};
