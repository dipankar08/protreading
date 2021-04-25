// Splash screen or boot screen is important for loading the boot data.

import { useContext, useEffect } from "react";
import { STYLES } from "../components/styles";
import { CoreStateContext } from "./CoreContext";
import { useCoreApi } from "./useCoreApi";
import { DButton, DContainer, DContainerSafe, DLayoutCol, DText, ScreenHeader } from "../components/basic";

// In this screen we are trying to import { CACHE_KEY_MARKET } from '../appstate/CONST';
export const BootScreen = ({ navigation }: any) => {
  const coreState = useContext(CoreStateContext);
  const coreApi = useCoreApi();
  useEffect(() => {
    coreApi.doAppBoot(() => {
      coreApi.navigateNext("BOOT", navigation);
    });
  }, []);

  return (
    <DContainer style={{ backgroundColor: STYLES.APP_COLOR_PRIMARY, justifyContent: "center", alignItems: "center", paddingHorizontal: 40 }}>
      <DText dark>Loading .....</DText>
      {coreApi.error.length > 0 ? <DText dark>{coreApi.error}</DText> : <DText>Please wait....</DText>}
    </DContainer>
  );
};
