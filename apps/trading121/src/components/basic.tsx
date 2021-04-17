import React from "react";
import { View, Text, TextInput, TouchableWithoutFeedback } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TProps } from "../screens/types";
import { TouchableOpacity } from "react-native-gesture-handler";
import { STYLES } from "./styles";
import { Inter_200ExtraLight } from "@expo-google-fonts/inter";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

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
    <TouchableOpacity onPress={onPress} style={{ width: "100%" }}>
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
          paddingHorizontal: 16,
          backgroundColor: "#ffffff10",
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
          display: "flex",
          flexDirection: "row",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export const DLayoutCol = ({ children, row, equal, center, style }: TProps) => {
  return (
    <View
      style={[
        {
          display: "flex",
          flexDirection: "column",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export const FlatListItemSeparator = () => {
  return (
    <View
      style={{
        height: 1,
        width: "100%",
        backgroundColor: "#00000020",
      }}
    />
  );
};

export const DListEmptyComponent = () => {
  return (
    <View style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 40 }}>
      <MaterialCommunityIcons name={"emoticon-sad-outline"} color="black" size={40} />
      <Text style={{ color: "red", textAlign: "center", marginTop: 16 }}>No item found</Text>
    </View>
  );
};

export const TextWithIcon = ({ style, onPress, text, icon }: TProps) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[{ display: "flex", flexDirection: "row", alignItems: "center" }, style]}>
        <MaterialCommunityIcons name={icon} color="black" size={24} />
        <TouchableOpacity onPress={onPress}>
          <Text style={{ fontSize: 16, color: "#000000", marginLeft: 8, textTransform: "capitalize" }}>{text}</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export const ScreenHeader = ({ navigation, title, icon, onPress, style, showBack }: any) => {
  return (
    <View
      style={[
        {
          display: "flex",
          flexDirection: "row",
          paddingVertical: 10,
          padding: 0,
          alignItems: "baseline",
        },
        style,
      ]}
    >
      {navigation ? (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 20 }}>
          <MaterialCommunityIcons name={"arrow-left"} color="black" size={24} />
        </TouchableOpacity>
      ) : (
        <View></View>
      )}
      <Text style={{ color: "#000000", fontWeight: "bold", fontSize: 22, flex: 1, textTransform: "capitalize" }}>{title}</Text>
      <TouchableOpacity onPress={onPress}>
        <MaterialCommunityIcons name={icon || "menu"} color="black" size={24} />
      </TouchableOpacity>
    </View>
  );
};
