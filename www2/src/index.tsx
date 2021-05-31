import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { CoreContextProvider } from "./components/coreState/useCoreGlobalSate";

ReactDOM.render(
  <React.StrictMode>
    <CoreContextProvider>
       <App />
    </CoreContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
