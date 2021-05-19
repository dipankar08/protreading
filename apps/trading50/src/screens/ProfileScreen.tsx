import React, { useContext, useEffect } from "react";
import { ScrollView } from "react-native";
// Use this cscreen for testing purpose
import { WebView } from "react-native-webview";
import { AppStateContext } from "../appstate/AppStateStore";
import { DContainerSafe, DLayoutCol, ScreenHeader } from "../components/basic";
import { DActionItemRow } from "../components/DList";
import { DTextSection } from "../components/DText";
import { LogoutCard } from "../core/LogoutCard";
import { useNetwork } from "../hooks/useNetwork";
import { dlog } from "../libs/dlog";
import { TProps } from "./types";

// Profile and Signout logic
export const ProfileScreen = ({ navigation, route }: TProps) => {
  const appState = useContext(AppStateContext);
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
          <LogoutCard
            onSignOut={() => {
              network.clearAllData();
            }}
          ></LogoutCard>
          <DTextSection>User Preferences</DTextSection>

          <DTextSection>System Preferences</DTextSection>
          <DActionItemRow title={"Domain"} value={appState.state.domain} onPress={() => setDomainDialogVisible(true)} icon="home" />
        </DLayoutCol>
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
