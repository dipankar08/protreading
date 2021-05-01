import React from "react";
import { View, Text, TextInput, TouchableWithoutFeedback, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TProps } from "../screens/types";
import { TouchableOpacity } from "react-native-gesture-handler";
import { STYLES } from "./styles";
import { Inter_200ExtraLight } from "@expo-google-fonts/inter";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { blue200 } from "react-native-paper/lib/typescript/styles/colors";
import _ from "underscore";
import { ButtonIcon } from "./DButton";
import { DLayoutCol, DLayoutRow } from "./basic";

export const DKeyValueList = ({ object }: TProps) => {
  console.log(object);
  return (
    <DLayoutCol style={{ width: "100%" }}>
      {object &&
        Object.keys(object).map((key) => (
          <DLayoutRow style={{ justifyContent: "space-between", paddingVertical: 5 }} key={key}>
            <Text>{key}:</Text>
            <Text style={{ paddingRight: 10 }}>{object[key]}</Text>
          </DLayoutRow>
        ))}
    </DLayoutCol>
  );
};
