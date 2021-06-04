import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { TDomain } from "../appstate/types";
import { DContainerSafe, DLayoutCol, DLayoutRow, ScreenHeader } from "../components/basic";
import { CoreStateContext } from "../components/core/CoreContext";
import { DOptionDialog } from "../components/DDialog";
import { DTextSection, DTextSectionWithButton } from "../components/DText";
import { dlog } from "../components/libs/dlog";
import { getString } from "../components/libs/stoarge";
import { showNotification } from "../components/libs/uihelper";
import { AppStateContext } from "./AppStateProvider";
import { getColorCode } from "./helper/helper";
import { TProps } from "./types";
import { domainList, useNetwork } from "./useNetwork";

export const HomeScreen = ({ navigation }: TProps) => {
  const appState = useContext(AppStateContext);
  const coreState = useContext(CoreStateContext);
  const network = useNetwork();
  const [loading, setLoading] = useState(false);
  const [domainDialogVisible, setDomainDialogVisible] = React.useState(false);


  let name = "Home";
  useEffect(() => {
    dlog.d(`Mounted ${name}`);
    (async function(){
       let domain = await  getString("DOMAIN")
       if(domain){
         network.changeDomain(domain as TDomain, {
            onBefore() {
              setLoading(true);
            },
            onComplete() {
              setLoading(false);
            },
            onSuccess() {
              showNotification("Data updated");
            },
            onError(error) {
              showNotification(error);
            },
         });
       } else {
         setDomainDialogVisible(true);
       }
    })();
    return () => {
      dlog.d(`Unmounted ${name}`);
    };
  }, [coreState.state.authInfo]);

  return (
    <DContainerSafe>
      <DLayoutCol style={{ padding: 16 }}>
        <ScreenHeader
          hideBack={true}
          navigation={navigation}
          leftIcon={"menu"}
          onPressLeftIcon={() => {
            navigation.toggleDrawer();
          }}
          loading={loading}
          title={"Home"}
          style={{ padding: 0 }}
          icon="reload"
          onPress={ async ()=> await network.refreshAllData({
            onBefore:()=>setLoading(true),
            onComplete:()=>setLoading(false)
          })}
        />
        <DTextSection>Summary({appState.state.domain})</DTextSection>
        <View style={styles.card}>
          <DLayoutRow style={{ flex: 1 }}>
            <DLayoutCol style={{ flex: 1 }}>
              <Text style={styles.textHeader}>Invested </Text>
              <Text style={styles.textValue}>{appState.state.position?.positionSummary?.invested_amount.toFixed(2)}</Text>
              <Text style={styles.textHeader}>Open Order #</Text>
              <Text style={styles.textValue}>{appState.state.position?.positionSummary?.open_order_count.toFixed(2)}</Text>
              <Text style={styles.textHeader}>Committed P/L</Text>
              <Text
                style={[
                  styles.textValue,
                  {
                    color:
                      getColorCode(appState.state.position?.positionSummary?.committed_pl),
                  },
                ]}
              >
                {appState.state.position?.positionSummary?.committed_pl.toFixed(2)} (
                {appState.state.position?.positionSummary?.committed_change.toFixed(2)}%)
              </Text>
              <Text style={styles.textHeader}>Net Profit</Text>
              <Text style={styles.textValue}>{appState.state.position?.positionSummary?.net_profit.toFixed(2)}</Text>
            </DLayoutCol>
            <DLayoutCol style={{ flex: 1, justifyContent: "flex-end", textAlign: "right", alignContent: "flex-end" }}>
              <Text style={[styles.textHeader, styles.right]}>Current </Text>
              <Text style={[styles.textValue, styles.right]}>{appState.state.position?.positionSummary?.current_amount.toFixed(2)}</Text>
              <Text style={[styles.textHeader, styles.right]}>Overall P/L</Text>
              <Text
                style={[
                  styles.textValue,
                  styles.right,
                  {
                    color:
                      getColorCode(appState.state.position?.positionSummary?.total_change)
                  },
                ]}
              >
                {appState.state.position?.positionSummary?.total_pl.toFixed(2)}({appState.state.position?.positionSummary?.total_change.toFixed(2)}%)
              </Text>
              <Text style={[styles.textHeader, styles.right]}>UnCommitted P/L</Text>
              <Text
                style={[
                  styles.textValue,
                  styles.right,
                  {
                    color:
                      getColorCode(appState.state.position?.positionSummary?.uncommitted_change)
                  },
                ]}
              >
                {appState.state.position?.positionSummary?.uncommitted_pl.toFixed(2)}(
                {appState.state.position?.positionSummary?.uncommitted_change.toFixed(2)}%)
              </Text>
              <Text style={[styles.textHeader, styles.right]}>Total Tax</Text>
              <Text style={[styles.textValue, styles.right]}>{appState.state.position?.positionSummary?.total_tax.toFixed(2)}</Text>
            </DLayoutCol>
          </DLayoutRow>
        </View>
        <DTextSectionWithButton icon={"plus"}>Focus Stocks</DTextSectionWithButton>
      </DLayoutCol>
      {loading && <ActivityIndicator size="large" color="#00ff00" />}
      <DOptionDialog
        title={"Choose the domain"}
        subtitle={"Once you chhhose the domain, the ticker will be shown from that domain only."}
        items={domainList}
        visible={domainDialogVisible}
        onCancel={() => setDomainDialogVisible(false)}
        onChange={(value) => {
          network.changeDomain(value as TDomain, {
                      onBefore() {
                        setLoading(true);
                      },
                      onComplete() {
                        setLoading(false);
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

const styles = StyleSheet.create({
  right: {
    textAlign: "right",
  },
  card: {
    backgroundColor: "#1584dc",
    height: 250,
    marginVertical: 10,
    padding: 10,
    borderRadius: 5,
  },
  textHeader: {
    flex: 1,
    color: "#ffffff",
    fontSize: 12,
    margin: 0,
  },
  textValue: {
    flex: 1,
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 15,
  },
});
