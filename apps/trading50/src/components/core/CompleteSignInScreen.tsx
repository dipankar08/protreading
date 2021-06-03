import React, { useContext, useEffect } from "react";
import logo from "../../../assets/images/icon_white.png";
import { TProps } from "../../screens/types";
import { DContainer, DLayoutCol } from "../basic";
import { DAppLogo } from "../DImage";
import { DLoadingText } from "../DText";
import { STYLES } from "../styles";
import { CoreStateContext } from "./CoreContext";
import { useCoreApi } from "./useCoreApi";

// Sign up logic...
export const CompleteSignInScreen = ({ navigation }: TProps) => {
  const coreState = useContext(CoreStateContext);
  const coreApi = useCoreApi();
  useEffect(() => {
    coreApi.doCompleteSignIn(() => {
      setTimeout(() => {
        coreApi.navigateNext(navigation);
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
