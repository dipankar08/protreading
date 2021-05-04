import { Route } from "@react-navigation/routers";
import { StyleSheet, TextStyle, ViewStyle } from "react-native";
import { TObject } from "../models/model";
export type TKeyText = {
  key: string;
  text: string;
};
export type TProps = {
  navigation?: any;
  children?: any;
  userToken?: string | null;
  overrideStyle?: ViewStyle;
  onPress?: any;
  style?: ViewStyle | TextStyle;
  pstyle?: ViewStyle | TextStyle; // mainly used for top level elemnet
  theme?: string;
  primary?: any;
  secondary?: any;
  center?: any;
  item?: any;
  text?: string;
  icon?: string;
  loading?: boolean;
  size?: number;
  color?: string;
  items?: Array<TObject | TKeyText>;
  object?: TObject;
  numberOfLines?: number;
  visible?: boolean;
};
