import React from "react";
import { View, Text, TextInput, TouchableWithoutFeedback, ScrollView } from "react-native";
import { TProps } from "../screens/types";
import _ from "underscore";
import { DLayoutCol, DLayoutRow } from "./basic";
import { colors } from "../styles/colors";
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
