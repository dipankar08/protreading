import React from "react";
import { RootSiblingParent } from "react-native-root-siblings";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppStateStoreProvider from "./src/appstate/AppStateStore";
import CoreStateStoreProvider from "./src/core/CoreContext";
import RootNavigation from "./src/screens/navigation";
import { colors } from "./src/styles/colors";

// You must given a name app
export default function App() {
  return (
    <SafeAreaProvider style={{ backgroundColor: colors.white }}>
      <CoreStateStoreProvider>
        <AppStateStoreProvider>
          <RootSiblingParent>
            <RootNavigation />
          </RootSiblingParent>
        </AppStateStoreProvider>
      </CoreStateStoreProvider>
    </SafeAreaProvider>
  );
}
