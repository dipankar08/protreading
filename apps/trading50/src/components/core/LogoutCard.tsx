import React, { useContext, useEffect } from "react";
import { Text } from "react-native";
import { Avatar } from "react-native-elements";
import { TProps } from "../../screens/types";
import { DCard, DLayoutCol, DLayoutRow } from "../basic";
import { DButtonPrimary } from "../DButton";
import { dlog } from "../libs/dlog";
import { CoreStateContext } from "./CoreContext";
import { useCoreApi } from "./useCoreApi";

// Simple Logout card which should be embedit in the app
export const LogoutCard = ({ navigation, route, onSignOut }: TProps) => {
  const coreState = useContext(CoreStateContext);
  const coreApi = useCoreApi();
  async function signOut() {
    dlog.d("calling sign out");
    onSignOut?.();
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
          <DButtonPrimary onPress={signOut} primary style={{ marginTop: 20 }}>
            Sign out
          </DButtonPrimary>
        </DLayoutCol>
      </DLayoutRow>
    </DCard>
  );
};
