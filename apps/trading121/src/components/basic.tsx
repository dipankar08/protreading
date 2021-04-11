import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TProps } from "../screens/types";

export const DCard = ({ children, overrideStyle }: TProps) => {
  return (
    <View
      style={[
        {
          width: "100%",
          marginVertical: 5,
          backgroundColor: "#ffffff",
          borderRadius: 10,
          padding: 20,
        },
        overrideStyle,
      ]}
    >
      {children}
    </View>
  );
};

export const DContainer = ({ children, overrideStyle }: TProps) => {
  return (
    <SafeAreaView
      style={[
        {
          backgroundColor: "#ffffff10",
          paddingRight: 5,
          paddingLeft: 5,
          flex: 1,
          flexDirection: "column",
        },
        overrideStyle,
      ]}
    >
      {children}
    </SafeAreaView>
  );
};

export const DSpace = ({ children, overrideStyle }: TProps) => {
  return (
    <View
      style={[
        {
          height: 20,
        },
        overrideStyle,
      ]}
    >
      {children}
    </View>
  );
};

export const DLayoutRow = ({ children, row, equal, center, overrideStyle }: any) => {
  return (
    <View
      style={[
        {
          flex: 1,
          flexDirection: "row",
        },
        overrideStyle,
      ]}
    >
      {children}
    </View>
  );
};

export const DLayoutCol = ({ children, row, equal, center, overrideStyle }: any) => {
  return (
    <View
      style={[
        {
          flex: 1,
          flexDirection: "column",
        },
        overrideStyle,
      ]}
    >
      {children}
    </View>
  );
};
