import React from "react";
import { Picker, TextInput } from "react-native";
import { TProps } from "../screens/types";
import { DButtonIcon } from "./DButton";
import { DIcon } from "./DIcon";
import { DLayoutRow } from "./DLayout";
import { colors } from "./res/colors";

export const DTextInput = ({ children, style, placeholder, onChangeText, multiline }: TProps) => {
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
      multiline={multiline || false}
    >
      {children || ""}
    </TextInput>
  );
};

export const DTextSearch = ({ children, style, onSearch, placeholder, onPressRightIcon }: TProps) => {
  return (
    <DLayoutRow
      style={[
        {
          backgroundColor: "#00000010",
          color: colors.black,
          borderWidth: 0,
          alignItems: "center",
          fontSize: 15,
          borderRadius: 10,
          paddingHorizontal: 16,
        },
        style,
      ]}
    >
      <DIcon icon="find-replace" style={{ color: colors.grey500, fontSize: 20 }}></DIcon>
      <TextInput
        onChangeText={onSearch}
        placeholder={placeholder || "type to search"}
        placeholderTextColor={colors.grey500}
        style={[
          {
            backgroundColor: "#00000000",
            color: colors.black,
            height: 38,
            fontSize: 15,
            padding: 8,
            paddingVertical: 8,
            paddingHorizontal: 8,
            flex: 1,
          },
        ]}
      >
        {children}
      </TextInput>
      <DButtonIcon icon="sort" style={{ color: colors.grey500, fontSize: 20 }} onPress={onPressRightIcon}></DButtonIcon>
    </DLayoutRow>
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
