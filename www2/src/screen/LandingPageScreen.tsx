import React from "react";
import { useHistory } from "react-router-dom";
import { LandingPage, samplePageConfig } from "../components/landingpage/LandingPage";
export const LandingPageScreen = () => {
  const history = useHistory();

  let pageConfig = samplePageConfig;
  pageConfig.heroTitle = "Find and invest on potential stocks";
  pageConfig.heroSubTitle = "Trading50 can help you to findout the best stock for tread...";
  return (
    <LandingPage
      pageConfig={pageConfig}
      onNavigateToHome={() => {
        history.push("/home");
      }}
    ></LandingPage>
  );
};
