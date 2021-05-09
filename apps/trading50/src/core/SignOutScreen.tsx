import React, { useContext, useEffect } from "react";
import { Avatar } from "react-native-elements";
import { AppStateContext } from "../appstate/AppStateStore";
import { DContainerSafe, DLayoutCol, ScreenHeader, DButton } from "../components/basic";
import { useNetwork } from "../hooks/useNetwork";
import { dlog } from "../libs/dlog";
import { deleteData } from "../libs/stoarge";
import { TProps } from "../screens/types";
import { Image, Text, View, StyleSheet } from "react-native";
import { DButtonPrimary } from "../components/DButton";

// Profile and Signout logic
export const SignOutScreen = ({ navigation, route }: TProps) => {
  const appState = useContext(AppStateContext);
  const network = useNetwork();
  async function signOut() {
    await deleteData("USER_INFO");
    appState.dispatch({ type: "MARK_USER_SIGNED_OUT" });
  }
  let name = "Profile";
  useEffect(() => {
    dlog.d(`Mounted ${name}`);
    return () => {
      dlog.d(`Unmounted ${name}`);
    };
  }, []);

  return (
    <DContainerSafe style={{ padding: 16 }}>
      <DLayoutCol style={{ alignContent: "center" }}>
        <ScreenHeader title="Market Summary" style={{ padding: 16 }}></ScreenHeader>
        <Avatar
          rounded
          size="large"
          source={{
            uri:
              "https://media-exp1.licdn.com/dms/image/C4D03AQG7ULIkCmRFTA/profile-displayphoto-shrink_200_200/0/1516571220413?e=1623283200&v=beta&t=zv1tVZEVQ51HgQeIejWGPSqFK5yHw8caNdlMtmXPzJM",
          }}
        />
        <Text style={{ color: "#000000ee", fontSize: 20, marginTop: 20, fontWeight: "bold" }}>{appState.state.userInfo.name}</Text>
        <Text style={{ color: "#000000ee", fontSize: 16, marginTop: 10, fontWeight: "normal" }}>Email - {appState.state.userInfo.email}</Text>
        <Text style={{ color: "#000000ee", fontSize: 16, marginTop: 10, fontWeight: "normal" }}>Id -{appState.state.userInfo.email}</Text>
        <Text style={{ fontSize: 20, marginTop: 10, paddingTop: 10, borderTopWidth: 1 }}>Update Data</Text>
        <DButtonPrimary style={{ marginEnd: 10 }} onPress={network.forceUpdateData}>
          Refresh Data in backend
        </DButtonPrimary>

        <Text style={{ flex: 1 }}>Hello</Text>
        <DButtonPrimary onPress={signOut} secondary>
          Sign out
        </DButtonPrimary>
        <DButton
          onPress={() => {
            navigation.push("TestScreen");
          }}
          secondary
        >
          Test
        </DButton>
      </DLayoutCol>
    </DContainerSafe>
  );
};
