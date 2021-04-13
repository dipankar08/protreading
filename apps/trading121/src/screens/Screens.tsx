import React from "react";
import { Button, StyleSheet, View, Text } from "react-native";
import { TProps } from "./types";
import { globalStyle } from "../components/styles";
import { DCard } from "../components/basic";
import { userBoot } from "../libs/boot_helper";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 10,
    borderRadius: 10,
  },
});

const ScreenContainer = ({ children }: TProps) => {
  return <View style={styles.container}>{children}</View>;
};

export const SplashScreen = () => {
  return (
    <ScreenContainer>
      <DCard>
        <Text>Splash...</Text>
        <Button title="action" onPress={() => alert("todo")} />
      </DCard>
    </ScreenContainer>
  );
};

export const SignInScreen = ({ navigation }: TProps) => {
  return (
    <ScreenContainer>
      <DCard overrideStyle={{ height: 200 }}>
        <Text style={[globalStyle.PrimaryText]}>Sign In</Text>
        <Button title="action" />
      </DCard>
    </ScreenContainer>
  );
};

export const SignUpScreen = ({ navigation }: TProps) => {
  return (
    <ScreenContainer>
      <Text>Create a new Account</Text>
      <Button title="action" onPress={() => alert("todo")} />
    </ScreenContainer>
  );
};

export const HomeScreen = ({ navigation }: TProps) => {
  return (
    <ScreenContainer>
      <Text>Main Home Screen</Text>
      {
        // pass the veriable to screen - just like intent
      }
      <Button title="Details-Title1" onPress={() => navigation.push("Details", { name: "Title1" })} />
      <Button title="Details-Title2" onPress={() => navigation.push("Details", { name: "Title2" })} />
    </ScreenContainer>
  );
};

export const ProfileScreen = ({ navigation }: TProps) => {
  return (
    <ScreenContainer>
      <Text>Profile</Text>
      <Button title="toggle drawer" onPress={() => navigation.toggleDrawer()} />
      <Button title="Sign Out" />
    </ScreenContainer>
  );
};

export const DetailsScreen = ({ route }: TProps) => {
  return (
    <ScreenContainer>
      <Text>Details</Text>
      {route.params.name && <Text>{route.params.name}</Text> /* Got the data */}
    </ScreenContainer>
  );
};

export const SearchScreen = () => {
  return (
    <ScreenContainer>
      <Text>Search</Text>
      <Button title="action" onPress={() => alert("todo")} />
    </ScreenContainer>
  );
};

export const SearchScreen2 = () => {
  return (
    <ScreenContainer>
      <Text>SearchScreen2</Text>
      <Button title="action" onPress={() => alert("todo")} />
    </ScreenContainer>
  );
};
