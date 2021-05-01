import React from "react";
import { ActivityIndicator, StyleSheet, Text, Image } from "react-native";
import { TProps } from "../screens/types";
import { DLayoutCol } from "./basic";
import { DTextSubTitle } from "./DText";

export const DAppLogo = ({ logo, text, size }: TProps) => {
  return (
    <DLayoutCol>
      <Image
        style={{
          width: size || 80,
          height: size || 80,
          backgroundColor: "transparent",
          alignSelf: "center",
          marginBottom: 0,
        }}
        source={logo}
      />
      {text && <DTextSubTitle>{text || "your app"}</DTextSubTitle>}
    </DLayoutCol>
  );
};
