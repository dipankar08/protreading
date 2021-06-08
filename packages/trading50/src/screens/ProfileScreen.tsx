import React, { useContext, useEffect } from "react";
import { ScrollView } from "react-native";
// Use this cscreen for testing purpose
import { WebView } from "react-native-webview";
import { TDomain } from "../appstate/types";
import { LogoutCard } from "../components/core/LogoutCard";
import { DOptionDialog } from "../components/DDialog";
import { ScreenHeader } from "../components/DExtendedLayout";
import { DContainerSafe, DLayoutCol } from "../components/DLayout";
import { DActionItemRow } from "../components/DList";
import { DTextSection } from "../components/DText";
import { dlog } from "../components/libs/dlog";
import { deleteData } from "../components/libs/stoarge";
import { showNotification } from "../components/libs/uihelper";
import { colors } from "../components/res/colors";
import { AppStateContext } from "./AppStateProvider";
import { TProps } from "./types";
import { domainList, useNetwork } from "./useNetwork";

// Profile and Signout logic
export const ProfileScreen = ({ navigation, route }: TProps) => {
  const appState = useContext(AppStateContext);
  const network = useNetwork();
  const [domainDialogVisible, setDomainDialogVisible] = React.useState(false);
  const [loadingChangeDomain, setLoadingChangeDomain] = React.useState(false);
  const [loadingLF, setLoadingRF] = React.useState(false);
  let name = "Profile";
  useEffect(() => {
    dlog.d(`Mounted ${name}`);
    return () => {
      dlog.d(`Unmounted ${name}`);
    };
  }, []);

  const [loadingRecalculate, setLoadingRecalculate] = React.useState(false);

  return (
    <DContainerSafe>
      <ScrollView>
        <DLayoutCol style={{ padding: 10 }}>
          <ScreenHeader title="Profile" navigation={navigation}></ScreenHeader>
          <LogoutCard
            style={{ backgroundColor: colors.blue400 }}
            onSignOut={async () => {
              await deleteData("DOMAIN");
              network.clearAllData();
            }}
          ></LogoutCard>
          <DTextSection>Preferences</DTextSection>
          <DActionItemRow
            title={"Change Country doamin"}
            value={`Your current domain is: ${appState.state.domain}`}
            loading={loadingChangeDomain}
            onPress={() => setDomainDialogVisible(true)}
            icon="home"
          />
          <DActionItemRow
            title="Recalculate Indicator"
            value="Clicking this will recompute the indicator in the backend."
            loading={loadingRecalculate}
            onPress={() =>
              network.recomputeIndicator({
                onBefore: () => setLoadingRecalculate(true),
                onComplete: () => {
                  setLoadingRecalculate(false);
                  showNotification("task submitted");
                },
              })
            }
            icon="reload"
          />
          <DActionItemRow
            title="Refresh Data"
            value="Update price and indicator information to latest market"
            loading={loadingLF}
            onPress={() =>
              network.refreshAllData({
                onBefore: () => setLoadingRF(true),
                onComplete: () => {
                  setLoadingRF(false);
                  showNotification("data updated!");
                },
              })
            }
            icon="download"
          />
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
              setLoadingChangeDomain(true);
            },
            onComplete() {
              setLoadingChangeDomain(false);
            },
            onSuccess() {
              showNotification("Data updated");
            },
            onError(error) {
              showNotification(error);
            },
          });
          setDomainDialogVisible(false);
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
