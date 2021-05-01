import React from "react";
import { DButton, DCard, DSpace, DText, DContainer, DLayoutCol, DTextInput, DContainerSafe, ScreenHeader, DLayoutRow } from "../components/basic";
import { TProps } from "./types";
import { useContext, useEffect, useState } from "react";
import { dlog } from "../libs/dlog";
import { useNetwork } from "../hooks/useNetwork";

// Profile and Signout logic
export const ProfileScreen = ({ navigation, route }: TProps) => {
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
        <ScreenHeader title="Profile" style={{ padding: 16 }}></ScreenHeader>
        <LogoutCard></LogoutCard>
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
export const TestScreen = () => {
  return (
    <DContainerSafe style={{ flex: 1 }}>
      <DLayoutCol style={{ flex: 1 }}>
        <WebView source={{ uri: "https://uk.tradingview.com/symbols/NSE-TCS/" }} style={{ flex: 1 }} />
      </DLayoutCol>
    </DContainerSafe>
  );
};
