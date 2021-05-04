import React from "react";
import { DButton, DCard, DSpace, DText, DContainer, DLayoutCol, DTextInput, DContainerSafe, ScreenHeader, DLayoutRow } from "../components/basic";
import { TProps } from "./types";
import { useContext, useEffect, useState } from "react";
import { dlog } from "../libs/dlog";
import { useNetwork } from "../hooks/useNetwork";

// Profile and Signout logic
export const ProfileScreen = ({ navigation, route }: TProps) => {
  let domainList = [
    { label: "UK", value: "UK" },
    { label: "INDIA", value: "IN" },
    { label: "USA", value: "USA" },
  ];
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
        <DDropDown items={domainList}></DDropDown>

        <DTextSection>System Preferences</DTextSection>

        <DButton style={{ marginEnd: 10 }} onPress={network.forceUpdateData}>
          Refresh Data in backend
        </DButton>
        <DButton
          onPress={() => {
            navigation.push("TestScreen");
          }}
          secondary
        >
          Test
        </DButton>
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
export const TestScreen = () => {
  return (
    <DContainerSafe style={{ flex: 1 }}>
      <DLayoutCol style={{ flex: 1 }}>
        <WebView source={{ uri: "https://uk.tradingview.com/symbols/NSE-TCS/" }} style={{ flex: 1 }} />
      </DLayoutCol>
    </DContainerSafe>
  );
};
