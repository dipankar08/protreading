// Use this cscreen for testing purpose
import React from "react";
import { WebView } from "react-native-webview";
import { DContainerSafe, DLayoutCol, DLayoutRow } from "../components/basic";
import { DButtonIcon } from "../components/DButton";
import { DTextSubTitle } from "../components/DText";
import { TProps } from "../screens/types";
import { colors } from "../styles/colors";

export const WebViewScreen = ({ route, navigation }: TProps) => {
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
