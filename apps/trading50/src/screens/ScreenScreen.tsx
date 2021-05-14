import React from "react";
import { DContainerSafe, DLayoutCol, ScreenHeader } from "../components/basic";
import { TProps } from "./types";
export let ScreenListScreen = ({ navigation }: TProps) => {
  return (
    <DContainerSafe>
      <DLayoutCol style={{ padding: 16 }}>
        <ScreenHeader
          title={"Screen"}
          style={{ padding: 0 }}
          icon="plus"
          onPress={() => {
            navigation.push("NewScreenScreen");
          }}
        />
      </DLayoutCol>
    </DContainerSafe>
  );
};
