import React from "react";
import { Avatar, Text, Button } from "react-native-elements";
import { Card } from "react-native-elements/dist/card/Card";
import { ScreenContainer } from "react-native-screens";
import { DCard, DContainer, DSpace } from "../components/basic";
import { AuthContext } from "../components/context";
import { TProps } from "./types";

export const ProfileScreen = ({ navigation }: TProps) => {
  const { signOut } = React.useContext(AuthContext);
  return (
    <DContainer overrideStyle={{ justifyContent: "center", alignItems: "center" }}>
      <DCard overrideStyle={{ justifyContent: "center", alignItems: "center" }}>
        <Avatar
          rounded
          size="large"
          source={{
            uri:
              "https://media-exp1.licdn.com/dms/image/C4D03AQG7ULIkCmRFTA/profile-displayphoto-shrink_200_200/0/1516571220413?e=1623283200&v=beta&t=zv1tVZEVQ51HgQeIejWGPSqFK5yHw8caNdlMtmXPzJM",
          }}
        />
        <DSpace />
        <Text h4>Dipankar Dutta</Text>
        <DSpace />
        <Button title="toggle drawer" onPress={() => navigation.toggleDrawer()} style={{ flex: 1 }} />
        <DSpace />
        <Button title="Sign Out" onPress={() => signOut()} />
      </DCard>
    </DContainer>
  );
};
