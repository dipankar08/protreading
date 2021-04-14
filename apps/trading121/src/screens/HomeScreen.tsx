import React, { useContext } from "react";

import { Button, Text, StyleSheet, View } from "react-native";
import { ScreenContainer } from "react-native-screens";
import { AppStateContext } from "../appstate/AppStateStore";
import { DCard, DContainer, DLayoutCol, DLayoutRow } from "../components/basic";
import { TProps } from "./types";
import { globalStyle } from "../components/styles";

export const HomeScreen = ({ navigation }: TProps) => {
  const appState = useContext(AppStateContext);
  return (
    <DContainer>
      <DLayoutCol>
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
    </DContainer>
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
