import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TProps } from "../screens/types";
import { TouchableOpacity } from "react-native-gesture-handler";

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

export const DContainerSafe = ({ children, overrideStyle }: TProps) => {
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
      ]}
    >
      {children}
    </SafeAreaView>
  );
};

export const DText = ({ children, style }: TProps) => {
  return <Text style={[{}, style]}>{children}</Text>;
};

export const DButton = ({ children, style, onPress }: TProps) => {
  return (
    <TouchableOpacity onPress={() => onPress()}>
      <Text
        style={[
          {
            backgroundColor: "blue",
            color: "white",
            textAlign: "center",
            paddingVertical: 10,
            borderRadius: 5,
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

export const DContainer = ({ children, overrideStyle }: TProps) => {
  return (
    <View
      style={[
        {
          backgroundColor: "#ffffff10",
          paddingRight: 5,
          paddingLeft: 5,
          flex: 1,
          flexDirection: "column",
        },
        overrideStyle,
      ]}
    >
      {children}
    </View>
  );
};

export const DSpace = ({ children, overrideStyle }: TProps) => {
  return (
    <View
      style={[
        {
          height: 20,
        },
        overrideStyle,
      ]}
    >
      {children}
    </View>
  );
};

export const DLayoutRow = ({ children, row, equal, center, overrideStyle }: any) => {
  return (
    <View
      style={[
        {
          flex: 1,
          flexDirection: "row",
        },
        overrideStyle,
      ]}
    >
      {children}
    </View>
  );
};

export const DLayoutCol = ({ children, row, equal, center, overrideStyle, style }: any) => {
  return (
    <View
      style={[
        {
          flex: 1,
          flexDirection: "column",
        },
        overrideStyle,
        style,
      ]}
    >
      {children}
    </View>
  );
};
