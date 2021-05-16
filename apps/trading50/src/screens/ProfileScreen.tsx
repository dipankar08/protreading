import React, { useContext, useEffect } from "react";
import { ScrollView } from "react-native";
// Use this cscreen for testing purpose
import { WebView } from "react-native-webview";
import { AppStateContext } from "../appstate/AppStateStore";
import { DContainerSafe, DLayoutCol, ScreenHeader } from "../components/basic";
import { DOptionDialog } from "../components/DDialog";
import { DActionItemRow } from "../components/DList";
import { DTextSection } from "../components/DText";
import { LogoutCard } from "../core/LogoutCard";
import { useNetwork } from "../hooks/useNetwork";
import { dlog } from "../libs/dlog";
import { TProps } from "./types";

// Profile and Signout logic
export const ProfileScreen = ({ navigation, route }: TProps) => {
  let domainList = [
    { key: "UK", text: "UK" },
    { key: "IN", text: "INDIA" },
    { key: "USA", text: "USA" },
  ];
  const appState = useContext(AppStateContext);
  const [domainDialogVisible, setDomainDialogVisible] = React.useState(false);
  const network = useNetwork();
  let name = "Profile";
  useEffect(() => {
    dlog.d(`Mounted ${name}`);
    return () => {
      dlog.d(`Unmounted ${name}`);
    };
  }, []);

  return (
    <DContainerSafe>
      <ScrollView>
        <DLayoutCol style={{ padding: 10 }}>
          <ScreenHeader title="Profile" navigation={navigation}></ScreenHeader>
          <DTextSection style={{ marginTop: 10 }}>Your Information</DTextSection>
          <LogoutCard></LogoutCard>
          <DTextSection>User Preferences</DTextSection>

          <DTextSection>System Preferences</DTextSection>
          <DActionItemRow title={"Domain"} value={appState.state.domain} onPress={() => setDomainDialogVisible(true)} icon="home" />
        </DLayoutCol>
        <DOptionDialog
          title={"Choose the domain"}
          subtitle={"Once you chhhose the domain, the ticker will be shown from that domain only."}
          items={domainList}
          visible={domainDialogVisible}
          onCancel={() => setDomainDialogVisible(false)}
          onChange={(value) => {
            network.changeDomain(value);
            setDomainDialogVisible(false);
          }}
        ></DOptionDialog>
      </ScrollView>
    </DContainerSafe>
  );
};

export const TestScreen = () => {
  return (
    <DContainerSafe style={{ flex: 1 }}>
      <DLayoutCol style={{ flex: 1 }}>
        <WebView source={{ uri: "https://uk.tradingview.com/symbols/NSE-TCS/" }} style={{ flex: 1 }} />
      </DLayoutCol>
    </DContainerSafe>
  );
};
