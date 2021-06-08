import React, { useContext, useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TProps } from "../../screens/types";
import { DContainer } from "../DLayout";
import { dlog } from "../libs/dlog";
import { colors } from "../res/colors";
import { CoreStateContext } from "./CoreContext";
import { useCoreApi } from "./useCoreApi";

const slides = [
  {
    key: "1", // this must be a string
    title: "Never miss any trading opportunity!",
    text: "There are trading opportunities everyday. Our AI system will provide daily recommendations for any buy and sell opportunity.",
    image: require("../../../assets/images/1.png"),
    backgroundColor: colors.cyan400,
  },
  {
    key: "2",
    title: "Get rid of emotional bias with Smart Portfolio.",
    text: "Smart portfolios allow you to track all orders you made in a break-up view or consoluteview. It provides exact take to home profit after tax, brokerage. This helps you to have a right balance between the investigation amount and cash in hand. ",
    image: require("../../../assets/images/2.png"),
    backgroundColor: colors.blue400,
  },
  {
    key: "3",
    title: "Advance Screen and Alerts",
    text: "Screen the stock list from India, USA and UK by varieties for technical indicators. Get real time alert when a  technical indicator meets some conditions!",
    image: require("../../../assets/images/3.png"),
    backgroundColor: colors.green400,
  },
];

// Sign up logic...
export const NuxScreen = ({ navigation }: TProps) => {
  const coreState = useContext(CoreStateContext);
  const coreApi = useCoreApi();
  function completeNux() {
    coreApi.doMarkNuxShown(() => {
      coreState.dispatch({ type: "MERGE_STATE", payload: { isNuxShown: true } });
      coreApi.navigateNext(navigation);
    });
  }
  let name = "NUX";
  useEffect(() => {
    dlog.d(`Mounted ${name}`);
    return () => {
      dlog.d(`Unmounted ${name}`);
    };
  }, []);
  return (
    <DContainer style={styles.container}>
      <AppIntroSlider
        renderItem={({ item }) => {
          return (
            <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
              <Text style={styles.title}>{item.title}</Text>
              <Image source={item.image} style={styles.img} />
              <Text style={styles.text}>{item.text}</Text>
            </View>
          );
        }}
        data={slides}
        onDone={completeNux}
        renderDoneButton={() => {
          return (
            <View style={styles.buttonCircle}>
              <MaterialCommunityIcons name="check" color={colors.green200} size={24} />
            </View>
          );
        }}
        renderNextButton={() => {
          return (
            <View style={styles.buttonCircle}>
              <MaterialCommunityIcons name="arrow-right" color={colors.white} size={24} />
            </View>
          );
        }}
      />
    </DContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    paddingHorizontal: 0,
    margin: 0,
  },
  slide: {
    flex: 1,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "yellow",
  },
  title: {
    fontWeight: "900",
    fontSize: 30,
    color: "white",
    marginBottom: 30,
    marginLeft: 30,
    marginRight: 30,
    textAlign: "center",
  },
  img: {
    resizeMode: "contain",
    backgroundColor: "transparent",
    height: 250,
  },
  text: {
    marginTop: 30,
    color: "white",
    fontSize: 15,
    paddingHorizontal: 30,
    textAlign: "center",
    marginBottom: 40,
  },
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(0, 0, 0, .2)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
