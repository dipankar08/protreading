import "antd/dist/antd.css";
import React from "react";
import "./asserts/css/app.scss";
import "./asserts/css/d.scss";
import { FilterPageScreen } from "./screen/FilterPageScreen";
function App() {
  return (
    <div className="App d_fullscreen">
      <FilterPageScreen />
    </div>
  );
}

export default App;
