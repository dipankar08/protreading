import React, { useContext, useEffect } from "react";

import { Button, Text, StyleSheet, View } from "react-native";
import { ScreenContainer } from "react-native-screens";
import { AppStateContext } from "../appstate/AppStateStore";
import { DCard, DContainer, DLayoutCol, DLayoutRow } from "../components/basic";
import { TProps } from "./types";
import { globalStyle } from "../components/styles";
import { getRequest } from "../libs/network";
import { CACHE_KEY_POSITION } from "../appstate/CONST";
import { verifyOrCrash } from "../libs/assert";
import { processPositionData } from "../models/processor";

export const HomeScreen = ({ navigation }: TProps) => {
  const appState = useContext(AppStateContext);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  useEffect(() => {
    async function loadInitData() {
      try {
        let position = await getRequest(
          `https://simplestore.dipankar.co.in/api/grodok_position?user_id=${appState.state.userInfo.user_id}&_limit=100`,
          CACHE_KEY_POSITION,
          false
        );
        verifyOrCrash(appState.state.market != null);
        appState.dispatch({ type: "UPDATE_POSITION", payload: processPositionData(position, appState.state.market) });
        setLoading(false);
      } catch (e) {
        setLoading(false);
        setError("Not able to get Data");
      }
    }
    loadInitData();
  }, []);

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
