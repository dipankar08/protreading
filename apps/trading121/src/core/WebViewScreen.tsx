// Use this cscreen for testing purpose
import { WebView } from "react-native-webview";
import React from "react";
import { DContainerSafe, DLayoutCol, DLayoutRow } from "../components/basic";
import { TProps } from "../screens/types";
import { DTextSubTitle } from "../components/DText";
import { colors } from "../styles/colors";
import { DButtonIcon } from "../components/DButton";

export const WebViewScreen = ({ route, navigation }: TProps) => {
  console.log(route);
  return (
    <DContainerSafe style={{ flex: 1 }}>
      <DLayoutCol style={{ flex: 1 }}>
        <DLayoutRow style={{ backgroundColor: colors.primary, marginTop: 0, color: colors.white, padding: 10, alignItems: "baseline" }}>
          <DButtonIcon
            icon="arrow-left"
            style={{ color: "white", marginRight: 10 }}
            onPress={() => {
              navigation.pop();
            }}
          ></DButtonIcon>
          <DTextSubTitle style={{ color: colors.white, marginTop: 0 }} numberOfLines={1}>
            {route.params.title || route.params.url || "External View"}
          </DTextSubTitle>
        </DLayoutRow>
        <WebView source={{ uri: route.params.url }} style={{ flex: 1 }} />
      </DLayoutCol>
    </DContainerSafe>
  );
};
