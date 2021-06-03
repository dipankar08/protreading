import React from "react";
import { Image } from "react-native";
import { STRINGS } from "../screens/res/strings";
import { TProps } from "../screens/types";
import { DLayoutCol } from "./basic";
import { DTextTitle } from "./DText";

export const DAppLogo = ({ logo, text, size }: TProps) => {
  return (
    <DLayoutCol>
      <Image
        style={{
          width: 100,
          height: 100,
          backgroundColor: "transparent",
          alignSelf: "center",
          marginBottom: 40,
        }}
        source={logo}
      />
      <DTextTitle style={{ color: "white", textAlign: "center", fontSize: 40 }}>{STRINGS.APP_NAME}</DTextTitle>
    </DLayoutCol>
  );
};
