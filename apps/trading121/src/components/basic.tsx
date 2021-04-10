import React from "react";
import { View } from "react-native";
import { TProps } from "../screens/types";

export const CardView = ({ children, overrideStyle }: TProps) => {
  return (
    <View
      style={[
        {
          width: "80%",
          margin: 20,
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
