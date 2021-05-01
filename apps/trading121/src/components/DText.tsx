import { TProps } from "../screens/types";
import React, { useState, useContext, useEffect } from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { DIMENS } from "../res/dimens";
import { DLayoutRow } from "./basic";
// For the the title of any
export const DTextTitle = ({ children, style }: TProps) => {
  return <Text style={[{ fontWeight: "bold", fontSize: 20 }, style]}>{children}</Text>;
};

export const DTextSubTitle = ({ children, style }: TProps) => {
  return <Text style={[{ fontWeight: "normal", fontSize: 16, marginTop: DIMENS.GAP_BETWEEN_ELEMENT }, style]}>{children}</Text>;
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
