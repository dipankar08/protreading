import React, { useContext } from "react";
import { TDomain } from "../appstate/types";
import { CoreStateContext } from "../components/core/CoreContext";
import { dlog } from "../components/libs/dlog";
import { AppStateContext } from "./AppStateProvider";

// This should contain effect that should execute once.
// You should not import other than app to ensure all the effect executes only once.
// THIS IS NOT WORKING
export const useGlobalEffect = () => {
  const appState = React.useContext(AppStateContext);
  const coreState = useContext(CoreStateContext);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [domain, setDomain] = React.useState<TDomain>(null);

  React.useEffect(() => {
    dlog.d(">>>>>>>>>>>>>>>>>>>>>>>>>domain change so refreshAllData ...<<<<<<<<<<<<<<<<<< ");
  }, [appState]);
};
