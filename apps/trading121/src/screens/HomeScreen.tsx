import React, { useContext, useEffect } from "react";

import { Button, Text, StyleSheet, View } from "react-native";
import { AppStateContext } from "../appstate/AppStateStore";
import { DCard, DContainer, DContainerSafe, DLayoutCol, DLayoutRow, ScreenHeader } from "../components/basic";
import { TProps } from "./types";
import { dlog } from "../libs/dlog";
import { useNetwork } from "../hooks/useNetwork";
import { useCoreApi } from "../core/useCoreApi";
import { CoreStateContext } from "../core/CoreContext";

export const HomeScreen = ({ navigation }: TProps) => {
  const appState = useContext(AppStateContext);
  const coreState = useContext(CoreStateContext);
  const network = useNetwork();

  let name = "Home";
  useEffect(() => {
    dlog.d(`Mounted ${name}`);
    network.doAllNetworkCallOnBoot();
    return () => {
      dlog.d(`Unmounted ${name}`);
    };
  }, [coreState.state.authInfo]);

  return (
    <DContainerSafe>
      <DLayoutCol style={{ padding: 16 }}>
        <ScreenHeader title={"Home"} style={{ padding: 0 }} icon="reload" onPress={network.fetchUserInfo} />
        <Text style={styles.headText}>Summary</Text>
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
                      appState.state.position?.positionSummary?.committed_pl && appState.state.position?.positionSummary?.committed_pl > 0
                        ? "#2cf21c"
                        : "#ffc300",
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
                      appState.state.position?.positionSummary?.total_change && appState.state.position?.positionSummary?.total_change > 0
                        ? "green"
                        : "#ff9800",
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
                      appState.state.position?.positionSummary?.uncommitted_change && appState.state.position?.positionSummary?.uncommitted_change > 0
                        ? "green"
                        : "#ffc300",
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
        <Text style={styles.headText}>Possible Buy</Text>
      </DLayoutCol>
    </DContainerSafe>
  );
};

const styles = StyleSheet.create({
  right: {
    textAlign: "right",
  },
  headText: {
    color: "#00000088",
    fontSize: 14,
    textTransform: "uppercase",
    marginTop: 10,
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
