import "antd/dist/antd.css";
import React from "react";
import "./asserts/css/app.scss";
import "./asserts/css/d.scss";
import { LandingPageScreen } from "./screen/LandingPageScreen";
function App() {
  return (
    <div className="App d_fullscreen">
      <LandingPageScreen />
    </div>
  );
}

export default App;
