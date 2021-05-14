import React from "react";
import { DCard, DSpace, DText, DContainer, DLayoutCol, DTextInput, DContainerSafe, ScreenHeader, DLayoutRow } from "../components/basic";
import { TProps } from "./types";
import { useContext, useEffect, useState } from "react";
import { dlog } from "../libs/dlog";
import { useNetwork } from "../hooks/useNetwork";

// Profile and Signout logic
export const ProfileScreen = ({ navigation, route }: TProps) => {
  let domainList = [
    { key: "UK", text: "UK" },
    { key: "IN", text: "INDIA" },
    { key: "USA", text: "USA" },
  ];
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
    <ScrollView>
      <DLayoutCol style={{ padding: 10 }}>
        <ScreenHeader title="Profile"></ScreenHeader>
        <DTextSection style={{ marginTop: 10 }}>Your Information</DTextSection>
        <LogoutCard></LogoutCard>
        <DTextSection>User Preferences</DTextSection>
        <DDropDown
          items={domainList}
          selectedValue={appState.state.domain}
          setSelectedValue={(key) => {
            console.log(key);
            network.changeDomain(key);
          }}
        ></DDropDown>

        <DTextSection>System Preferences</DTextSection>

        <DButtonPrimary style={{ marginEnd: 10 }} onPress={network.forceUpdateData}>
          Refresh Data in backend
        </DButtonPrimary>
        <DButtonPrimary
          onPress={() => {
            navigation.push("TestScreen");
          }}
          secondary
        >
          Test
        </DButtonPrimary>
        <DTextSection>App Information</DTextSection>
        <AppInfoCard />
      </DLayoutCol>
    </ScrollView>
  );
};

// Use this cscreen for testing purpose
import { WebView } from "react-native-webview";
import { LogoutCard } from "../core/LogoutCard";
import { AppInfoCard } from "../core/AppInfoCard";
import { ScrollView } from "react-native";
import { DTextSection } from "../components/DText";
import { DDropDown } from "../components/DInput";
import { DButtonPrimary } from "../components/DButton";
import { AppStateContext } from "../appstate/AppStateStore";
export const TestScreen = () => {
  return (
    <DContainerSafe style={{ flex: 1 }}>
      <DLayoutCol style={{ flex: 1 }}>
        <WebView source={{ uri: "https://uk.tradingview.com/symbols/NSE-TCS/" }} style={{ flex: 1 }} />
      </DLayoutCol>
    </DContainerSafe>
  );
};