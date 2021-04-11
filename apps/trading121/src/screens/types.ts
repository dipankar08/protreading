import { Route } from "@react-navigation/routers";
import { StyleSheet, ViewStyle } from "react-native";
export type TProps = {
  navigation?: any;
  children?: any;
  userToken?: string | null;
  overrideStyle?: ViewStyle;
};
