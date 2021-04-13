import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootNavigation from "./src/screens/navigation";
import { registerRootComponent } from "expo";
import { Provider as PaperProvider } from "react-native-paper";
import { getTheme } from "./src/hooks/theme";
import AppStateStoreProvider from "./src/appstate/AppStateStore";
import { CounterProvider } from "./src/appstate/counter";
export default function App() {
  const theme = getTheme();
  return (
    <SafeAreaProvider>
      <AppStateStoreProvider>
        <RootNavigation />
      </AppStateStoreProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
registerRootComponent(App);
