import "antd/dist/antd.css";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./asserts/css/app.scss";
import "./asserts/css/d.scss";
import { FilterPageScreen } from "./screen/FilterPageScreen";
import { LandingPageScreen } from "./screen/LandingPageScreen";
function App() {
  return (
    <Router>
      <div className="App d_fullscreen">
        <Switch>
          <Route path="/home">
            <FilterPageScreen />
          </Route>
          <Route path="/">
            <LandingPageScreen />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
