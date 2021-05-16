import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import _ from "underscore";
import { TProps } from "../screens/types";
import { colors } from "../styles/colors";
import { DLayoutCol, DLayoutRow, DSpace } from "./basic";
import { DTextSubTitle } from "./DText";

function toString(data: any) {
  if (data == undefined || data == null) {
    return "-";
  }
  if (_.isObject(data)) {
    return JSON.stringify(data);
  }
  return data + "";
}

export const DKeyValueList = ({ object }: TProps) => {
  console.log(object);
  return (
    <DLayoutCol style={{ width: "100%" }}>
      {object &&
        Object.keys(object).map((key) => (
          <DLayoutRow style={{ justifyContent: "space-between", paddingVertical: 10, borderColor: colors.grey100, borderBottomWidth: 1 }} key={key}>
            <DTextSubTitle style={{ paddingLeft: 10 }}>{key}:</DTextSubTitle>
            <DTextSubTitle style={{ paddingRight: 10 }}>{toString(object[key])}</DTextSubTitle>
          </DLayoutRow>
        ))}
    </DLayoutCol>
  );
};

export const DActionItemRow = ({ style, title, value, icon, onPress }: TProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <DLayoutRow style={{ marginVertical: 10, alignItems: "center" }}>
        {icon && <MaterialCommunityIcons name={icon} color="black" size={18} style={{ marginRight: 10 }} />}
        <DTextSubTitle>{title + ":  "}</DTextSubTitle>
        <DTextSubTitle>{value}</DTextSubTitle>
        <DSpace />
        <MaterialCommunityIcons name={"arrow-right"} color="black" size={18} style={{ marginLeft: 10 }} />
      </DLayoutRow>
    </TouchableOpacity>
  );
};
