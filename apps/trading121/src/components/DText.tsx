import { TProps } from "../screens/types";
import React, { useState, useContext, useEffect } from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { DIMENS } from "../res/dimens";
import { DLayoutRow } from "./basic";
import { DButtonIcon, DButtonWithIcon } from "./DButton";
// For the the title of any
export const DTextTitle = ({ children, style }: TProps) => {
  return <Text style={[{ fontWeight: "bold", fontSize: 20 }, style]}>{children}</Text>;
};

export const DTextSubTitle = ({ children, style, numberOfLines }: TProps) => {
  return (
    <Text numberOfLines={numberOfLines} style={[{ fontWeight: "normal", fontSize: 16, marginTop: DIMENS.GAP_BETWEEN_ELEMENT }, style]}>
      {children}
    </Text>
  );
};

export const DTextFooter = ({ children, style }: TProps) => {
  return <Text style={[{ fontWeight: "normal", fontSize: 12, marginTop: DIMENS.GAP_BETWEEN_ELEMENT, opacity: 0.7 }, style]}>{children}</Text>;
};

export const DLoadingText = ({ color, style, children }: TProps) => {
  return (
    <DLayoutRow>
      <ActivityIndicator size="small" color={color || "black"} />
      <Text style={{ color: color, marginLeft: 10, fontSize: 16 }}>{children || "hello"}</Text>
    </DLayoutRow>
  );
};

export const DScreenTitle = ({ children, style }: TProps) => {
  return <Text style={{ color: "#000000", fontWeight: "bold", fontSize: 23.5, flex: 1, textTransform: "capitalize" }}>{children}</Text>;
};

export const DTextSection = ({ children, style }: TProps) => {
  return (
    <Text
      style={[
        { color: "#11111199", fontSize: 15.5, textTransform: "uppercase", marginTop: 10, marginTop: DIMENS.GAP_2X, marginBottom: DIMENS.GAP_4 },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export const DTextSectionWithButton = ({ children, style, icon, onPress }: TProps) => {
  return (
    <DLayoutRow style={{ paddingTop: DIMENS.GAP_2X, marginBottom: DIMENS.GAP_4 }}>
      <Text
        style={[
          {
            color: "#11111199",
            flex: 1,
            justifyContent: "center",
            alignContent: "center",
            fontSize: 15.5,
            textTransform: "uppercase",
          },
          style,
        ]}
      >
        {children}
      </Text>
      <DButtonIcon icon={icon} onPress={onPress} style={{ paddingTop: 0, alignSelf: "baseline" }}></DButtonIcon>
    </DLayoutRow>
  );
};
