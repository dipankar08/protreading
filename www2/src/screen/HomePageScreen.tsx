import React from "react";
import { useHistory } from "react-router-dom";
import { CoreContext } from "../components/coreState/useCoreGlobalSate";
export const HomePageScreen = () => {
  const history = useHistory();
  const coreContext = React.useContext(CoreContext);
  return (
  <div></div>
  );
};
