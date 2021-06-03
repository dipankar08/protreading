import React, { useContext, useEffect } from "react";
import { ScrollView } from "react-native";
// Use this cscreen for testing purpose
import { WebView } from "react-native-webview";
import { TDomain } from "../appstate/types";
import { DContainerSafe, DLayoutCol, ScreenHeader } from "../components/basic";
import { LogoutCard } from "../components/core/LogoutCard";
import { DOptionDialog } from "../components/DDialog";
import { DActionItemRow } from "../components/DList";
import { DTextSection } from "../components/DText";
import { dlog } from "../components/libs/dlog";
import { deleteData } from "../components/libs/stoarge";
import { showNotification } from "../components/libs/uihelper";
import { AppStateContext } from "./AppStateProvider";
import { TProps } from "./types";
import { domainList, useNetwork } from "./useNetwork";

// Profile and Signout logic
export const ProfileScreen = ({ navigation, route }: TProps) => {
  const appState = useContext(AppStateContext);
  const network = useNetwork();
    const [domainDialogVisible, setDomainDialogVisible] = React.useState(false);
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
            onSignOut={async () => {
              await deleteData("DOMAIN")
              network.clearAllData();
            }}
          ></LogoutCard>
          <DTextSection>User Preferences</DTextSection>

          <DTextSection>System Preferences</DTextSection>
          <DActionItemRow title={"Domain"} value={`Your current domain is: ${appState.state.domain}`} onPress={() => setDomainDialogVisible(true)} icon="home" />
        </DLayoutCol>
      </ScrollView>
            <DOptionDialog
        title={"Choose the domain"}
        subtitle={"Once you chhhose the domain, the ticker will be shown from that domain only."}
        items={domainList}
        visible={domainDialogVisible}
        onCancel={() => setDomainDialogVisible(false)}
        onChange={(value) => {
          network.changeDomain(value as TDomain, {
                      onBefore() {
                        //setLoading(true);
                      },
                      onComplete() {
                        //setLoading(false);
                      },
                      onSuccess() {
                        showNotification("Data updated");
                      },
                      onError(error) {
                        showNotification(error);
                      },
                  });
                  setDomainDialogVisible(false)
        }}
      ></DOptionDialog>
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
