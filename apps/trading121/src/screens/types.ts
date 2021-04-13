import { Route } from "@react-navigation/routers";
import { StyleSheet, TextStyle, ViewStyle } from "react-native";
export type TProps = {
  navigation?: any;
  children?: any;
  userToken?: string | null;
  overrideStyle?: ViewStyle;
  onPress?: any;
  style?: ViewStyle | TextStyle;
  theme?: string;
  primary?: any;
  secondary?: any;
  center?: any;
};
