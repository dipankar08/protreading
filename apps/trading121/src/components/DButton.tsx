import React from "react";
import { TProps } from "../screens/types";
import { STYLES } from "./styles";
import { colors } from "../styles/colors";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { DLayoutRow } from "./basic";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { DIMENS } from "../res/dimens";

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

export const ButtonIcon = ({ onPress, icon, size, color, loading }: TProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      {loading && <ActivityIndicator size="small" color={color || "black"} />}
      {!loading && <MaterialCommunityIcons name={icon || "menu"} color={color || "black"} size={size || 24} />}
    </TouchableOpacity>
  );
};
