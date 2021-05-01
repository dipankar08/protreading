import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootNavigation from "./src/screens/navigation";
import { registerRootComponent } from "expo";
import AppStateStoreProvider from "./src/appstate/AppStateStore";
import CoreStateStoreProvider from "./src/core/CoreContext";
import { DStatusBar } from "./src/components/DStatusBar";

// You must given a name app
export default function App() {
  return (
    <SafeAreaProvider>
      <CoreStateStoreProvider>
        <AppStateStoreProvider>
          <RootNavigation />
        </AppStateStoreProvider>
      </CoreStateStoreProvider>
    </SafeAreaProvider>
  );
}

//registerRootComponent(App);
/*
export default App;

// ---- WE ARE UISNG CODE PUSH --
const codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_START,
};
const App1 = CodePush(codePushOptions)(App);
//registerRootComponent(app);
//export default app;
*/
