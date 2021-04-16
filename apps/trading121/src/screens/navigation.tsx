// We use the patterns defined in https://github.com/ReactNativeSchool/getting-started-react-navigation-v5/blob/master/App/index.js
import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SearchScreen, SearchScreen2 } from "./Screens";
import { PositionScreen } from "./PositionScreen";
import { MarketScreen, MarketScreenList } from "./MarketScreen";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TProps } from "./types";

import { SplashScreen, SignInScreen, SignUpScreen, ProfileScreen } from "./StartUpScreens";
import { AppStateContext } from "../appstate/AppStateStore";
import { HomeScreen } from "./HomeScreen";

// authstack
const AuthStack = createStackNavigator();
const AuthStackScreen = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
    <AuthStack.Screen name="CreateAccount" component={SignUpScreen} options={{ title: "Create Account" }} />
  </AuthStack.Navigator>
);

// Home Stack
const HomeStack = createStackNavigator();
const HomeStackScreen = ({ navigation }: TProps) => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      name="Home"
      component={HomeScreen}
      options={{
        title: "Home",
        headerStyle: {
          backgroundColor: "#f4511e",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "normal",
        },
        headerLeft: () => <MaterialCommunityIcons name="menu" color="white" size={24} style={{ marginLeft: 10 }} />,
      }}
    />
  </HomeStack.Navigator>
);

/// serach
const SearchStack = createStackNavigator();
const SearchStackScreen = () => (
  <SearchStack.Navigator>
    <SearchStack.Screen name="Search" component={SearchScreen} />
    <SearchStack.Screen name="Search2" component={SearchScreen2} />
  </SearchStack.Navigator>
);

// Profile Stack
const ProfileStack = createStackNavigator();
const ProfileStackScreen = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        title: "Profile",
        headerStyle: {
          backgroundColor: "#f4511e",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "normal",
        },
      }}
    />
  </ProfileStack.Navigator>
);

// Market Stack
const MarketStack = createStackNavigator();
const MarketStackScreen = () => (
  <MarketStack.Navigator initialRouteName="MarketList">
    <MarketStack.Screen
      name="Market"
      component={MarketScreen}
      options={{
        title: "Market",
        headerShown: false,
        headerStyle: {
          backgroundColor: "#f4511e",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "normal",
        },
      }}
    />
    <MarketStack.Screen
      name="MarketList"
      component={MarketScreenList}
      options={{
        title: "Market",
        headerShown: false,
        headerStyle: {
          backgroundColor: "#f4511e",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "normal",
        },
      }}
    />
  </MarketStack.Navigator>
);

// Position Stack
const PositionStack = createStackNavigator();
const PositionStackScreen = () => (
  <PositionStack.Navigator>
    <PositionStack.Screen
      name="Position"
      component={PositionScreen}
      options={{
        title: "Position",
        headerShown: false,
        headerStyle: {
          backgroundColor: "#f4511e",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "normal",
        },
      }}
    />
  </PositionStack.Navigator>
);

// Button Tabs
const Tabs = createBottomTabNavigator();
const TabsScreen = () => (
  <Tabs.Navigator
    initialRouteName="Home"
    tabBarOptions={{
      activeTintColor: "#e91e63",
      keyboardHidesTabBar: true,
      showLabel: true,
    }}
  >
    <Tabs.Screen
      name="Home"
      component={HomeStackScreen}
      options={{
        tabBarLabel: "Home",
        tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="home" color={color} size={size} />,
      }}
    />
    <Tabs.Screen
      name="Market"
      component={MarketStackScreen}
      options={{
        title: "Market",
        tabBarLabel: "Market",
        tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="trending-up" color={color} size={size} />,
      }}
    />
    <Tabs.Screen
      name="Position"
      component={PositionStackScreen}
      options={{
        tabBarLabel: "Position",
        tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="camera-iris" color={color} size={size} />,
      }}
    />
    <Tabs.Screen
      name="Profile"
      component={ProfileStackScreen}
      options={{
        tabBarLabel: "Profile",
        tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account" color={color} size={size} />,
      }}
    />
  </Tabs.Navigator>
);

// Drawer -- This actually a home
const Drawer = createDrawerNavigator();
const DrawerScreen = () => (
  <Drawer.Navigator initialRouteName="Home">
    <Drawer.Screen name="Home" component={TabsScreen} />
    <Drawer.Screen name="Profile" component={ProfileStackScreen} />
  </Drawer.Navigator>
);

// Root Stack
const RootStack = createStackNavigator();
const RootStackScreen = ({ userToken }: TProps) => {
  const appState = useContext(AppStateContext);
  return (
    <RootStack.Navigator headerMode="none">
      {appState.state.isLoggedIn ? (
        <RootStack.Screen
          name="App"
          component={DrawerScreen}
          options={{
            animationEnabled: false,
          }}
        />
      ) : (
        <RootStack.Screen
          name="Auth"
          component={AuthStackScreen}
          options={{
            animationEnabled: false,
          }}
        />
      )}
    </RootStack.Navigator>
  );
};

const RootNavigation = () => {
  const appState = useContext(AppStateContext);

  if (appState.state.isBootComplete) {
    return (
      <NavigationContainer>
        <RootStackScreen />
      </NavigationContainer>
    );
  } else {
    return <SplashScreen />;
  }
};

export default RootNavigation;
