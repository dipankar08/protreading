import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { BootScreen } from "./BootScreen";
import { NuxScreen } from "./NUXScreen";
import { SignInScreen } from "./SignInScreen";
import { SignUpScreen } from "./SignUpScreen";
import { SignOutScreen } from "./SignOutScreen";
import { CompleteSignInScreen } from "./CompleteSignInScreen";

// coreStack == BOOT+AUTH+NUX+LOGOUT
const CoreStack = createStackNavigator();
export const CoreStackScreen = () => (
  <CoreStack.Navigator>
    <CoreStack.Screen name="BootScreen" component={BootScreen} options={{ headerShown: false }} />
    <CoreStack.Screen name="NuxScreen" component={NuxScreen} options={{ headerShown: false }} />
    <CoreStack.Screen name="SignInScreen" component={SignInScreen} options={{ headerShown: false }} />
    <CoreStack.Screen name="SignUpScreen" component={SignUpScreen} options={{ headerShown: false }} />
    <CoreStack.Screen name="SignOutScreen" component={SignOutScreen} options={{ headerShown: false }} />
    <CoreStack.Screen name="CompleteSignInScreen" component={CompleteSignInScreen} options={{ headerShown: false }} />
  </CoreStack.Navigator>
);
