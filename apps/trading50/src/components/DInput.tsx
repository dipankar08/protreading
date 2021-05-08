import React from "react";
import { View, Text, TextInput, TouchableWithoutFeedback, ScrollView, Picker } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TProps } from "../screens/types";
import { TouchableOpacity } from "react-native-gesture-handler";
import { STYLES } from "./styles";
import { Inter_200ExtraLight } from "@expo-google-fonts/inter";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { blue200 } from "react-native-paper/lib/typescript/styles/colors";
import _ from "underscore";
import { DButtonIcon } from "./DButton";
import { DScreenTitle } from "./DText";
import { colors } from "../styles/colors";

export const DTextInput = ({ children, style, placeholder, onChangeText }: TProps) => {
  return (
    <TextInput
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#00000066"
      style={[
        {
          backgroundColor: "#00000000",
          color: colors.black,
          borderColor: colors.black,
          borderWidth: 1,
          padding: 10,
          paddingVertical: 10,
          marginVertical: 8,
          borderRadius: 4,
          textTransform: "uppercase",
        },
        style,
      ]}
    >
      {children}
    </TextInput>
  );
};

// items = [{ label: "Item 1", value: "item1" },..]
export const DDropDown = ({ items, setSelectedValue, selectedValue }: TProps) => {
  let serviceItems = items.map((i) => {
    return <Picker.Item key={i.key} value={i.key} label={i.text} />;
  });
  return (
    <Picker
      selectedValue={selectedValue}
      style={{ height: 50, width: 100, backgroundColor: "#000" }}
      onValueChange={(itemValue, itemIndex) => setSelectedValue?.(itemValue)}
    >
      {serviceItems}
    </Picker>
  );
};
