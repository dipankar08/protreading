import React from "react";
import { View, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TProps } from "../screens/types";
import { TouchableOpacity } from "react-native-gesture-handler";
import { STYLES } from "./styles";

export const DCard = ({ children, overrideStyle }: TProps) => {
  return (
    <View
      style={[
        {
          width: "100%",
          marginVertical: 5,
          backgroundColor: "#ffffff",
          borderRadius: 10,
          padding: 20,
        },
        overrideStyle,
      ]}
    >
      {children}
    </View>
  );
};

export const DContainerSafe = ({ children, overrideStyle, style }: TProps) => {
  return (
    <SafeAreaView
      style={[
        {
          backgroundColor: "#ffffff10",
          paddingRight: 5,
          paddingLeft: 5,
          flex: 1,
          flexDirection: "column",
        },
        overrideStyle,
        style,
      ]}
    >
      {children}
    </SafeAreaView>
  );
};

export const DText = ({ children, style, center, bold, primary, secondary, dark, caption }: TProps) => {
  return (
    <Text
      style={[
        {
          fontSize: caption ? 10 : primary ? 16.5 : 12.5,
          color: dark ? "white" : secondary ? "#11111199" : "#111111",
          marginVertical: 8, // DO NOT OVERRIDE
          fontWeight: bold ? "bold" : "normal",
          textAlign: center ? "center" : "left",
        },
        {},
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export const DButton = ({ children, style, primary, secondary, onPress, dark }: TProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text
        style={[
          {
            backgroundColor: primary ? (dark ? "white" : STYLES.APP_COLOR_PRIMARY) : "#00000000",
            color: dark ? (primary ? STYLES.APP_COLOR_PRIMARY : "white") : primary ? "white" : STYLES.APP_COLOR_PRIMARY,
            borderColor: dark ? "white" : STYLES.APP_COLOR_PRIMARY,
            borderWidth: 1,
            textAlign: "center",
            paddingVertical: 10,
            marginVertical: 8,
            borderRadius: 6,
            textTransform: "uppercase",
          },
          style,
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};

export const DTextInput = ({ children, style, dark, placeholder, onChangeText }: TProps) => {
  return (
    <TextInput
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={dark ? "#ffffff99" : "#11111199"}
      style={[
        {
          placeholder: placeholder,
          backgroundColor: "#00000000",
          color: dark ? "white" : STYLES.APP_COLOR_PRIMARY,
          borderColor: dark ? "white" : STYLES.APP_COLOR_PRIMARY,
          borderWidth: 1,
          padding: 10,
          paddingVertical: 10,
          marginVertical: 8,
          borderRadius: 6,
          textTransform: "uppercase",
        },
        style,
      ]}
    >
      {children}
    </TextInput>
  );
};
export const DContainer = ({ children, style }: TProps) => {
  return (
    <View
      style={[
        {
          backgroundColor: "#ffffff10",
          paddingRight: 5,
          paddingLeft: 5,
          flex: 1,
          width: "100%",
          height: "100%",
          flexDirection: "column",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export const DSpace = ({ children, style }: TProps) => {
  return (
    <View
      style={[
        {
          height: 20,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export const DLayoutRow = ({ children, row, equal, center, style }: any) => {
  return (
    <View
      style={[
        {
          flex: 1,
          flexDirection: "row",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export const DLayoutCol = ({ children, row, equal, center, style }: any) => {
  return (
    <View
      style={[
        {
          flex: 1,
          flexDirection: "column",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};
