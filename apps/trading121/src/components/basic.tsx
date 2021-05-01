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
          backgroundColor: STYLES.APP_SCREEN_BACKGROUND,
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

export const QuickButton = ({ children, onPress, style }: TProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ width: "100%" }}>
      <Text
        style={[
          {
            backgroundColor: STYLES.APP_COLOR_PRIMARY,
            color: "white",
            textAlign: "center",
            paddingVertical: 2,
            paddingHorizontal: 10,
            marginRight: 10,
            borderRadius: 10,
            fontSize: 14,
            textTransform: "capitalize",
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
          backgroundColor: STYLES.APP_SCREEN_BACKGROUND,
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

export const DLayoutRow = ({ children, center, style }: TProps) => {
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

export const DLayoutCol = ({ children, center, style }: TProps) => {
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

function toString(data: any) {
  if (data == undefined || data == null) {
    return "-";
  }
  if (_.isObject(data)) {
    return JSON.stringify(data);
  }
  return data + "";
}

export const DKeyValueList = ({ items }: any) => {
  return (
    <ScrollView style={{ height: "80%" }}>
      {Object.keys(items).map((key) => (
        <DLayoutRow style={{ justifyContent: "space-between", paddingVertical: 5 }} key={key}>
          <Text>{key}:</Text>
          <Text style={{ paddingRight: 10 }}>{toString(items[key])}</Text>
        </DLayoutRow>
      ))}
    </ScrollView>
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

export const ScreenHeader = ({ navigation, title, icon, onPress, style, showBack, loading }: any) => {
  return (
    <View
      style={[
        {
          display: "flex",
          flexDirection: "row",
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
      {icon && <ButtonIcon icon={icon} size={24} color="black" loading={loading || false} onPress={onPress}></ButtonIcon>}
    </View>
  );
};

// It should be start as a capital letter
export const B = (props: any) => <Text style={{ fontWeight: "bold", marginEnd: 6 }}>{props.children}</Text>;
export const Span = ({ style, children }: TProps) => (
  <View style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", marginEnd: 6 }}>{children}</View>
);
export const I = ({ children }: TProps) => <Text style={{ fontStyle: "italic" }}>{children}</Text>;
export const P = ({ children }: TProps) => <Text style={{ color: "#111111" }}>{children}</Text>;
export const Sub = ({ children }: TProps) => <Text style={{ color: "#11111160", marginEnd: 6 }}>{children}</Text>;
export const A = (props: any) => (
  <TouchableOpacity onPress={props.onPress}>
    <Text style={{ fontStyle: "italic", color: "red" }}>{props.children}</Text>;
  </TouchableOpacity>
);
