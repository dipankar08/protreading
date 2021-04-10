import React, { Component } from "react";
import { StyleSheet, Text, View, Image, Animated } from "react-native";

import logo from "../res/image/logo.png";

export default class LoadingScreen extends Component {
  state = {
    mLogoAni: new Animated.Value(0),
    mLogoText: new Animated.Value(0),
    mLoadingSpinner: false,
  };
  componentDidMount() {
    const { mLogoAni, mLogoText } = this.state;
    Animated.parallel([
      Animated.spring(mLogoAni, {
        toValue: 1,
        tension: 10,
        friction: 2,
        useNativeDriver: false,
      }),
    ]).start(() => {});
    Animated.timing(mLogoText, { toValue: 1, useNativeDriver: false });
    console.log("booted");
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#5257f2",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Animated.View
          style={{
            opacity: this.state.mLogoAni,
            top: this.state.mLogoAni.interpolate({
              inputRange: [0, 1],
              outputRange: [80, 0],
            }),
          }}
        >
          <Image
            style={{
              width: 100,
              height: 100,
              backgroundColor: "transparent",
            }}
            source={logo}
          />
        </Animated.View>
        <Animated.View
          style={{
            opacity: this.state.mLogoText,
          }}
        >
          <Text
            style={{
              color: "#ffffff",
              fontFamily: "",
              fontSize: 30,
              marginTop: 30,
              fontWeight: "300",
            }}
          >
            Loading...
          </Text>
        </Animated.View>
      </View>
    );
  }
}
