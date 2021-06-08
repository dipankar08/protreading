import React from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TProps } from "../screens/types";

export const DIcon = ({ icon, size, style }: TProps) => {
  return <MaterialCommunityIcons name={icon || "trending-neutral"} color="white" size={size || 18} style={style} />;
};
