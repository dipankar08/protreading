import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import _ from "underscore";
import { TProps } from "../screens/types";
import { DLayoutCol, DLayoutRow } from "./basic";
import { DTextSubTitle, DTextTitle } from "./DText";
import { colors } from "./res/colors";

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
  return (
    <DLayoutCol style={{ width: "100%" }}>
      {object &&
        Object.keys(object).map((key) => (
          <DLayoutRow style={{ justifyContent: "space-between", paddingVertical: 10, borderColor: colors.grey100, borderBottomWidth: 1 }} key={key}>
            <DTextSubTitle style={{ paddingRight: 10 }}>{key}:</DTextSubTitle>
            <DTextSubTitle style={{ paddingLeft: 10 }}>{toString(object[key])}</DTextSubTitle>
          </DLayoutRow>
        ))}
      {!object && <DTextSubTitle style={{ textAlign: "center", flex: 1, width: "100%", color: colors.blue500 }}>No item found</DTextSubTitle>}
      {object && Object.keys(object).length == 0 && (
        <DTextSubTitle style={{ textAlign: "center", flex: 1, width: "100%", color: colors.blue500 }}>No item found</DTextSubTitle>
      )}
    </DLayoutCol>
  );
};

export const DActionItemRow = ({ style, title, value, icon, onPress }: TProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <DLayoutRow style={{marginLeft:10, marginRight:10, marginBottom:10, borderBottomWidth:1, borderColor:colors.grey200, paddingVertical:10, alignItems:'center'}}>
        {icon && <MaterialCommunityIcons name={icon} color={colors.grey600} size={36} style={{ marginRight: 20, paddingTop:2 }} />}
          <DLayoutCol style={{flex:1}}>
              <DTextTitle style={{flex:1}}>{title}</DTextTitle>
              <DTextSubTitle style={{color:colors.grey600}}>{value}</DTextSubTitle>
          </DLayoutCol>
    <MaterialCommunityIcons name={"arrow-right"} color="black" size={24} style={{ marginLeft: 10 }} />
      </DLayoutRow>
     
    </TouchableOpacity>
  );
};
