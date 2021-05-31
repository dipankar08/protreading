import React from "react";
import { useHistory } from "react-router-dom";
import { TLoginInfo } from "../components/coreState/stateSpec";
import { CoreContext } from "../components/coreState/useCoreGlobalSate";
import { LandingPage, samplePageConfig } from "../components/landingpage/LandingPage";
export const LandingPageScreen = () => {
  const history = useHistory();
  const coreContext = React.useContext(CoreContext);

  let pageConfig = samplePageConfig;
  pageConfig.heroTitle = "Find and invest on potential stocks";
  pageConfig.heroSubTitle = "Trading50 can help you to find out the best stock for tread...";
  pageConfig.onLoginSuccess=(data:TLoginInfo)=>{
      coreContext.update({loginInfo:{name:data.name, id:data.id, email:data.email, profilePicture:data.profilePicture}})
  }
  pageConfig.onLogout=()=>{
    coreContext.update({loginInfo:undefined})
  }
  return (
    <LandingPage
      pageConfig={pageConfig}
      onNavigateToHome={() => {
        history.push("/home");
      }}
    ></LandingPage>
  );
};
