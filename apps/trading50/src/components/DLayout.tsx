import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TProps } from "../screens/types";
import { STYLES } from "./styles";

export const DContainerSafe = ({ children, overrideStyle, style }: TProps) => {
  return (
    <SafeAreaView
      style={[
        {
          backgroundColor: STYLES.APP_SCREEN_BACKGROUND,
          flex: 1,
          flexDirection: "column",
        },
        overrideStyle,
        style,
      ]}
    >
      {children}
    </SafeAreaView>
  );
};

export const DContainer = ({ children, style }: TProps) => {
  return (
    <View
      style={[
        {
          paddingHorizontal: 16,
          backgroundColor: STYLES.APP_SCREEN_BACKGROUND,
          flex: 1,
          flexDirection: "column",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export const DSpace = ({ children, style }: TProps) => {
  return <View style={{ flex: 1 }}></View>;
};

export const DLayoutRow = ({ children, center, style }: TProps) => {
  return (
    <View
      style={[
        {
          display: "flex",
          flexDirection: "row",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export const DLayoutCol = ({ children, center, style }: TProps) => {
  return (
    <View
      style={[
        {
          display: "flex",
          flexDirection: "column",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export const DCard = ({ style, children }: TProps) => {
  return (
    <View
      style={[
        {
          display: "flex",
          flexDirection: "column",

          //alignContent: "center",
          //alignItems: "center",

          width: "100%",
          backgroundColor: "#00000010",
          padding: 20,
          borderRadius: 4,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};
