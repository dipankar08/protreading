import React, { useContext } from "react";
import { Component } from "react";
import { DButton, DContainer, DContainerSafe, DLayoutCol, DText, ScreenHeader } from "../components/basic";
import CodePush from "react-native-code-push";
export class DebugScreen extends Component {
  componentDidMount() {
    //CodePush.sync({ installMode: CodePush.InstallMode.ON_NEXT_RESUME }, this.syncWithCodePush);
    this.checkEnable();
  }

  checkEnable = async () => {
    //const enabled = await Analytics.isEnabled();
    // console.log("analytics : " + enabled);
  };
  syncWithCodePush = (status: any) => {
    console.log("sync with code push : " + status);
  };
  createNativeCrash = () => {
    // const test: any = {};
    // console.log(test.should.crash);
    // Analytics.trackEvent("ClickEvent");
    // throw new Error('My Test crash!');
    //Crashes.generateTestCrash();
    // throw new Error('This is a test javascript crash!');
  };
  createJSCrash = () => {
    // const test: any = {};
    // console.log(test.should.crash);
    // Analytics.trackEvent("ClickEvent");
    // throw new Error('My Test crash!');
    //Crashes.generateTestCrash();
    // throw new Error('This is a test javascript crash!');
  };

  sendEvent = () => {
    Analytics.trackEvent("ClickEvent");
  };

  render() {
    return (
      <DContainerSafe>
        <DLayoutCol style={{ padding: 16 }}>
          <ScreenHeader title={"Debug Settings"} style={{ padding: 0 }} icon="sort-reverse-variant" />
          <DText>Debug Menu</DText>
          <DButton onPress={this.sendEvent}>Send Event</DButton>
          <DButton onPress={this.createNativeCrash}>Test Crash(Native)</DButton>
          <DButton onPress={this.createJSCrash}>Test Crash(JS)</DButton>
          <DButton onPress={this.syncWithCodePush}>CodePush</DButton>
        </DLayoutCol>
      </DContainerSafe>
    );
  }
}
