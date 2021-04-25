import { useContext, useEffect } from "react";
import { DButton, DContainer, DText } from "../components/basic";
import { dlog } from "../libs/dlog";
import { TProps } from "../screens/types";
import { CoreStateContext } from "./CoreContext";
import { useCoreApi } from "./useCoreApi";

// Sign up logic...
export const NuxScreen = ({ navigation }: TProps) => {
  const coreState = useContext(CoreStateContext);
  const coreApi = useCoreApi();
  function completeNux() {
    coreApi.doMarkNuxShown(() => {
      coreApi.navigateNext("NUX", navigation);
    });
  }
  let name = "NUX";
  useEffect(() => {
    dlog.d(`Mounted ${name}`);
    return () => {
      dlog.d(`Unmounted ${name}`);
    };
  }, []);
  return (
    <DContainer>
      <DText>NUX SCREEN</DText>
      <DButton onPress={completeNux}>COMPLETE</DButton>
    </DContainer>
  );
};
