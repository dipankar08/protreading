import React from "react";
import { RootSiblingParent } from "react-native-root-siblings";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppStateStoreProvider from "./src/appstate/AppStateStore";
import CoreStateStoreProvider from "./src/core/CoreContext";
import RootNavigation from "./src/screens/navigation";

// You must given a name app
export default function App() {
  return (
    <SafeAreaProvider>
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
