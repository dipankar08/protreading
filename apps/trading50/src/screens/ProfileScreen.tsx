import { default as React, default as React, useContext, useEffect } from "react";
import { ScrollView } from "react-native";
// Use this cscreen for testing purpose
import { WebView } from "react-native-webview";
import { AppStateContext } from "../appstate/AppStateStore";
import { DContainerSafe, DLayoutCol, ScreenHeader } from "../components/basic";
import { DButtonPrimary } from "../components/DButton";
import { DDropDown } from "../components/DInput";
import { DTextSection } from "../components/DText";
import { AppInfoCard } from "../core/AppInfoCard";
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

<<<<<<< HEAD
=======
// Use this cscreen for testing purpose
import { WebView } from "react-native-webview";
import { LogoutCard } from "../core/LogoutCard";
import { AppInfoCard } from "../core/AppInfoCard";
import { ScrollView } from "react-native";
import { DTextSection } from "../components/DText";
import { DDropDown } from "../components/DInput";
import { DButtonPrimary } from "../components/DButton";
import { AppStateContext } from "../appstate/AppStateStore";
>>>>>>> 3d894acbf16b14c999db417f0ef34739a68e7c1f
export const TestScreen = () => {
  return (
    <DContainerSafe style={{ flex: 1 }}>
      <DLayoutCol style={{ flex: 1 }}>
        <WebView source={{ uri: "https://uk.tradingview.com/symbols/NSE-TCS/" }} style={{ flex: 1 }} />
      </DLayoutCol>
    </DContainerSafe>
  );
};
