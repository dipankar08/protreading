import React from "react";
import { RootSiblingParent } from "react-native-root-siblings";
import { SafeAreaProvider } from "react-native-safe-area-context";
import CoreStateStoreProvider from "./src/components/core/CoreContext";
import { colors } from "./src/components/res/colors";
import AppStateStoreProvider from "./src/screens/AppStateProvider";
import RootNavigation from "./src/screens/navigation";
import { useGlobalEffect } from './src/screens/useGlobalEffect';

// You must given a name app
export default function App() {
  const globalEffect = useGlobalEffect();
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
