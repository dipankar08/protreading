import React, { useContext } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { AppStateContext } from "../appstate/AppStateStore";
import { DContainerSafe, DLayoutCol, ScreenHeader } from "../components/basic";
import { DButtonPrimary } from "../components/DButton";
import { DKeyValueList } from "../components/DList";
import { DTextSection } from "../components/DText";
import { AppInfoCard } from "../core/AppInfoCard";
import { useNetwork } from "../hooks/useNetwork";
import { TProps } from "./types";
export const DebugScreen = ({ navigation }: TProps) => {
  const appState = useContext(AppStateContext);
  const [domainDialogVisible, setDomainDialogVisible] = React.useState(false);
  const network = useNetwork();
  return (
    <DContainerSafe>
      <ScrollView>
        <DLayoutCol style={{ padding: 16 }}>
          <ScreenHeader navigation={navigation} title={"Debug Settings"} style={{ padding: 0 }} icon="sort-reverse-variant" />
          <DTextSection style={{ marginTop: 20 }}>App Information</DTextSection>
          <AppInfoCard />
          <DTextSection style={{ marginTop: 40 }}>Data Information</DTextSection>
          <DKeyValueList
            object={{
              "1D Data": "NA",
              "5M Data": "NA",
              "1H Data": "NA",
            }}
          ></DKeyValueList>
          <DButtonPrimary style={{ marginTop: 10 }} onPress={network.forceUpdateData}>
            Refresh Data in backend
          </DButtonPrimary>
        </DLayoutCol>
      </ScrollView>
    </DContainerSafe>
  );
};
