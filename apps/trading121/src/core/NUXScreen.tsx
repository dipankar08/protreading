import React from "react";
import { useContext, useEffect } from "react";
import { DButton, DContainer, DText } from "../components/basic";
import { dlog } from "../libs/dlog";
import { TProps } from "../screens/types";
import { CoreStateContext } from "./CoreContext";
import { useCoreApi } from "./useCoreApi";
import { StyleSheet } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import { View, Text, Image } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { colors } from "../styles/colors";

const slides = [
  {
    key: 1,
    title: "Smart Market Research",
    text: "With Trading50, We provided useful insights of the market",
    image: require("../../assets/images/1.png"),
    backgroundColor: colors.cyan400,
  },
  {
    key: 2,
    title: "Smart Portfolios",
    text: "Other cool stuff",
    image: require("../../assets/images/2.png"),
    backgroundColor: colors.blue400,
  },
  {
    key: 3,
    title: "Alerts and Screens",
    text: "Always keep notfied with useful alerts",
    image: require("../../assets/images/3.png"),
    backgroundColor: colors.green400,
  },
];

// Sign up logic...
export const NuxScreen = ({ navigation }: TProps) => {
  const coreState = useContext(CoreStateContext);
  const coreApi = useCoreApi();
  function completeNux() {
    coreApi.doMarkNuxShown(() => {
      coreApi.navigateNext("NUX", navigation);
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
        //onDone={completeNux}
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
  },
  img: {
    resizeMode: "contain",
    backgroundColor: "transparent",
    height: 250,
  },
  text: {
    marginTop: 100,
    color: "white",
    fontSize: 15,
    paddingHorizontal: 30,
    textAlign: "center",
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
