import React from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { DButtonIcon } from "./DButton";
import { DScreenTitle } from "./DText";
import { DIMENS } from "./res/dimens";

export const ScreenHeader = ({
  navigation, // pass navigation if yu want to suport back.
  title, // title
  icon, // icon right
  onPress, // onpress on icon right
  style,
  loading,
  leftIcon,
  onPressLeftIcon,
  hideBack,
  color,
}: any) => {
  return (
    <View
      style={[
        {
          display: "flex",
          flexDirection: "row",
          padding: 0,
          alignItems: "center",
          paddingHorizontal: DIMENS.GAP_FROM_EDGE,
          marginBottom: 8,
        },
        style,
      ]}
    >
      {leftIcon && (
        <DButtonIcon
          icon={leftIcon}
          size={24}
          color={color || "black"}
          loading={false}
          onPress={onPressLeftIcon}
          style={{ marginRight: DIMENS.GAP_2X }}
        ></DButtonIcon>
      )}
      {navigation && !hideBack ? (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 20 }}>
          <MaterialCommunityIcons name={"arrow-left"} color={color || "black"} size={24} />
        </TouchableOpacity>
      ) : (
        <View></View>
      )}
      <DScreenTitle style={{ color: color || "black", marginTop: 0 }}>{title}</DScreenTitle>
      {icon && <DButtonIcon icon={icon} size={24} color={color || "black"} loading={loading || false} onPress={onPress}></DButtonIcon>}
    </View>
  );
};
