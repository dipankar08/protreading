import React, { useContext, useEffect } from "react";
import { DContainer, DText, DButton } from "../components/basic";
import { dlog } from "../libs/dlog";
import { TProps } from "../screens/types";
import { CoreStateContext } from "./CoreContext";
import { useCoreApi } from "./useCoreApi";

// Sign up logic...
export const CompleteSignInScreen = ({ navigation }: TProps) => {
  const coreState = useContext(CoreStateContext);
  const coreApi = useCoreApi();
  useEffect(() => {
    coreApi.doCompleteSignIn(() => {
      coreState.dispatch({ type: "MERGE_STATE", payload: { isSilentSignInComplete: true } });
      coreApi.navigateNext("SIGN_IN_COMPLETE", navigation);
    });
  }, []);
  return (
    <DContainer>
      <DText>Trying to fetching latest data...(silent signin)</DText>
      <DButton />
    </DContainer>
  );
};
