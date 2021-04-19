import React, { useContext, useEffect } from "react";

import { Button, Text, StyleSheet, View } from "react-native";
import { AppStateContext } from "../appstate/AppStateStore";
import { DCard, DContainer, DContainerSafe, DLayoutCol, DLayoutRow, ScreenHeader } from "../components/basic";
import { TProps } from "./types";
import { dlog } from "../libs/dlog";
import { useNetwork } from "../hooks/useNetwork";

export const HomeScreen = ({ navigation }: TProps) => {
  const appState = useContext(AppStateContext);
  const network = useNetwork();

  let name = "Home";
  useEffect(() => {
    dlog.d(`Mounted ${name}`);
    network.fetchUserInfo();
    return () => {
      dlog.d(`Unmounted ${name}`);
    };
  }, [appState.state.isLoggedIn]);

  return (
    <DContainerSafe>
      <DLayoutCol>
        <ScreenHeader title={"Home"} style={{ padding: 0 }} icon="sort-reverse-variant" />
        <Text style={styles.headText}>Summary</Text>
        <View style={styles.card}>
          <DLayoutRow style={{ flex: 1 }}>
            <DLayoutCol style={{ flex: 1 }}>
              <Text style={styles.textHeader}>Invested </Text>
              <Text style={styles.textValue}>{appState.state.position?.positionSummary?.invested_amount} INR</Text>
              <Text style={styles.textHeader}>Profit</Text>
              <Text style={styles.textValue}>{appState.state.position?.positionSummary?.change_amount} INR</Text>
            </DLayoutCol>
            <DLayoutCol style={{ flex: 1 }}>
              <Text style={styles.textHeader}>Current </Text>
              <Text style={styles.textValue}>{appState.state.position?.positionSummary?.current_amount} INR</Text>
              <Text style={styles.textHeader}>Profit</Text>
              <Text style={styles.textValue}>{appState.state.position?.positionSummary?.change_per}%</Text>
            </DLayoutCol>
          </DLayoutRow>
        </View>
        <Text style={styles.headText}>Possible Buy</Text>
      </DLayoutCol>
    </DContainerSafe>
  );
};

const styles = StyleSheet.create({
  headText: {
    color: "#00000088",
    fontSize: 14,
    textTransform: "uppercase",
    marginTop: 10,
  },
  card: {
    backgroundColor: "#03a9f4",
    height: 180,
    marginVertical: 10,
    padding: 20,
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
    fontSize: 20,
    marginBottom: 15,
  },
});
