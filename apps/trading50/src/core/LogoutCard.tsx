import React, { useContext, useEffect } from "react";
import { Avatar } from "react-native-elements";
import { AppStateContext } from "../appstate/AppStateStore";
import { DContainerSafe, DLayoutCol, ScreenHeader, DButton, DLayoutRow, DCard } from "../components/basic";
import { useNetwork } from "../hooks/useNetwork";
import { dlog } from "../libs/dlog";
import { deleteData } from "../libs/stoarge";
import { TProps } from "../screens/types";
import { Image, Text, View, StyleSheet } from "react-native";
import { CoreStateContext } from "./CoreContext";
import { useCoreApi } from "./useCoreApi";
import { colors } from "../styles/colors";
import { Updates, Constants } from "expo";
import { BootScreen } from "./BootScreen";

// Simple Logout card which should be embedit in the app
export const LogoutCard = ({ navigation, route }: TProps) => {
  const coreState = useContext(CoreStateContext);
  const coreApi = useCoreApi();
  async function signOut() {
    dlog.d("calling sign out");
    coreApi.doSignOut();
    coreApi.navigateTo(navigation, "BootScreen");
  }
  let name = "Profile";
  useEffect(() => {
    dlog.d(`Mounted ${name}`);
    return () => {
      dlog.d(`Unmounted ${name}`);
    };
  }, []);

  return (
    <DCard>
      <DLayoutRow style={{ alignItems: "center" }}>
        <Avatar
          rounded
          size="large"
          source={{
            uri: coreState.state.authInfo?.profile_image || "https://th.bing.com/th/id/OIP.dP2eSw-0tAwPBH4GM_9q9wEsDW?pid=ImgDet&w=150&h=107&c=7",
          }}
        />
        <DLayoutCol style={{ flex: 1, marginLeft: 50 }}>
          <Text style={{ color: "#000000ee", fontSize: 20, fontWeight: "bold" }}>{coreState.state.authInfo?.name}</Text>
          <Text style={{ color: "#000000ee", fontSize: 14, marginTop: 10, fontWeight: "normal" }}>Email:{coreState.state.authInfo?.email}</Text>
          <Text style={{ color: "#000000ee", fontSize: 14, marginTop: 10, fontWeight: "normal" }}>Id:{coreState.state.authInfo?.user_id}</Text>
          <DButton onPress={signOut} primary style={{ marginTop: 20 }}>
            Sign out
          </DButton>
        </DLayoutCol>
      </DLayoutRow>
    </DCard>
  );
};
