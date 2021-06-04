import React, { useEffect, useState } from "react";
import { Image } from "react-native";
import logo from "../../../assets/images/icon_white.png";
import { STRINGS } from "../../screens/res/strings";
import { TProps } from "../../screens/types";
import { DButtonLink, DButtonWithIcon } from "../DButton";
import { DPrompt } from "../DDialog";
import { DContainer } from "../DLayout";
import { DTextFooter, DTextSubTitle, DTextTitle } from "../DText";
import { dlog } from "../libs/dlog";
import { showNotification } from "../libs/uihelper";
import { colors } from "../res/colors";
import { DIMENS } from "../res/dimens";
import { STYLES } from "../styles";
import { useCoreApi } from "./useCoreApi";
// Sign in Logics
export const SignInScreen = ({ navigation }: TProps) => {
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingFacebook, setLoadingFacebook] = useState(false);
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
    <DContainer style={{ backgroundColor: STYLES.APP_COLOR_PRIMARY, justifyContent: "center", paddingHorizontal: 20, alignItems: "center" }}>
      <Image
        style={{
          width: 100,
          height: 100,
          backgroundColor: "transparent",
          alignSelf: "center",
          marginBottom: 40,
        }}
        source={logo}
      />
      <DTextTitle style={{ color: "white", textAlign: "center", fontSize: 40 }}>{STRINGS.APP_NAME}</DTextTitle>

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
      {visibleGuest && (
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
            coreApi.loginAsGuest(text.toLocaleLowerCase().trim(), {
              onSuccess: () => {
                coreApi.navigateTo(navigation, "CompleteSignInScreen");
              },
            });
          }}
          onCancel={() => setVisibleGuest(false)}
        ></DPrompt>
      )}
    </DContainer>
  );
};
