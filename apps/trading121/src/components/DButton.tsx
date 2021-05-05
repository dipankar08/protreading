import React from "react";
import { TProps } from "../screens/types";
import { STYLES } from "./styles";
import { colors } from "../styles/colors";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { DIMENS } from "../res/dimens";
import { DLayoutRow } from "./DLayout";

export const DButtonWithIcon = ({ children, style, onPress, icon, loading }: TProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ width: "100%" }}>
      <DLayoutRow
        style={[
          {
            justifyContent: "center",
            alignContent: "center",
            backgroundColor: STYLES.BLACK,
            color: colors.black,
            textAlign: "center",
            paddingVertical: 10,
            marginTop: DIMENS.GAP_2X,
            borderRadius: 6,
          },
          style,
        ]}
      >
        {loading && <ActivityIndicator size="small" color="white" style={{ marginLeft: 10 }} />}
        <MaterialCommunityIcons name={icon || "trending-neutral"} color="white" size={18} style={{ marginLeft: 10 }} />
        <Text
          style={[
            {
              color: colors.white,
              marginLeft: DIMENS.GAP_1X,
              textTransform: "uppercase",
            },
          ]}
        >
          {children}
        </Text>
      </DLayoutRow>
    </TouchableOpacity>
  );
};

export const DButtonIcon = ({ onPress, icon, size, color, loading, style }: TProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      {loading && <ActivityIndicator size="small" color={color || "black"} />}
      {!loading && <MaterialCommunityIcons name={icon || "menu"} color={color || "black"} size={size || 24} style={style} />}
    </TouchableOpacity>
  );
};

export const DButtonPrimary = ({ onPress, icon, size, color, loading, children, pstyle, style }: TProps) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={loading} style={pstyle}>
      <DLayoutRow
        style={[
          {
            backgroundColor: color || colors.green600,
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderRadius: 6,
            marginTop: DIMENS.GAP_2X,
            justifyContent: "center",
          },
          style,
        ]}
      >
        {loading && <ActivityIndicator size="small" color={"white"} />}
        {!loading && <Text style={{ color: "white" }}>{children}</Text>}
      </DLayoutRow>
    </TouchableOpacity>
  );
};

export const DButtonLink = ({ onPress, color, loading, children, style }: TProps) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={loading}>
      <Text style={[{ color: color || colors.blue700 }, style]}>{children}</Text>
    </TouchableOpacity>
  );
};

export const DButtonTag = ({ onPress, color, loading, text, style }: TProps) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={loading}>
      <DLayoutRow
        style={[
          {
            color: "white",
            backgroundColor: color || "#ff8303",
            borderRadius: 10,
            textTransform: "uppercase",
          },
          style,
        ]}
      >
        <Text
          style={[
            {
              textAlign: "center",
              fontSize: 10,
              color: "white",
              paddingVertical: 5,
              paddingHorizontal: 10,
              textTransform: "uppercase",
            },
          ]}
        >
          {text || "hello"}
        </Text>
      </DLayoutRow>
    </TouchableOpacity>
  );
};