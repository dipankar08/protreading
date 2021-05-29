import { CSSProperties } from "react";

export type TObject = { [key: string]: any };
export type TRecord = { [key: string]: string };
export type TVoidCalBack = () => void;
export type TStringCallback = (str: string) => void;
export type TErrorCallback = (str: string) => void;
export type TSuccessCallback = (obj: any) => void;
export type TAnyCallback = (obj: any) => void;

export type TAuthInfo = {
  user_id: string;
  name: string;
  email?: string;
  profile_image?: string;
};
export type TCallback = {
  onBefore?: TVoidCalBack;
  onSuccess?: TSuccessCallback;
  onError?: TErrorCallback;
  onComplete?: TVoidCalBack;
};

export type TSimpleStoreResp = {
  status: "success" | "error";
  msg: string;
  out: Object;
};

export type TKeyText = {
  key: string;
  text: string;
};
export type TProps = {
  navigation?: any;
  route?: any;
  children?: any;
  userToken?: string | null;
  //overrideStyle?: ViewStyle;
  onPress?: any;
  style?: CSSProperties | undefined;
  //pstyle?: ViewStyle | TextStyle; // mainly used for top level elemnet
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
  objArray?: Array<TObject>;
  object?: TObject;
  numberOfLines?: number;
  visible?: boolean;
  onSearch?: TStringCallback;
  onChangeText?: TStringCallback;
  title?: string;
  subtitle?: string;
  placeholder?: string;
  onPressRightIcon?: TVoidCalBack;
  onPressLeftIcon?: TVoidCalBack;
  value?: any;
  onOk?: TVoidCalBack;
  onCancel?: TVoidCalBack;
  onChange?: TAnyCallback;
  onSignOut?: TVoidCalBack;
};
