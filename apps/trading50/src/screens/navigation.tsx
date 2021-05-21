// We use the patterns defined in https://github.com/ReactNativeSchool/getting-started-react-navigation-v5/blob/master/App/index.js
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useContext } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { CoreStateContext } from "../core/CoreContext";
import { CoreStackScreen } from "../core/core_navigation";
import { WebViewScreen } from "../core/WebViewScreen";
import { DebugScreen } from "./DebugScreen";
import { HomeScreen } from "./HomeScreen";
import { LiveTVScreen } from "./LiveTvScreen";
import { MarketGroupListScreen, MarketScreen } from "./MarketScreen";
import { NewScreenScreen } from "./NewScreenScreen";
import { PositionScreen } from "./PositionScreen";
import { ProfileScreen, TestScreen } from "./ProfileScreen";
import { ScreenListScreen } from "./ScreenListScreen";
import { SearchScreen, SearchScreen2 } from "./Screens";
import { TProps } from "./types";

// Home Stack
const HomeStack = createStackNavigator();
const HomeStackScreen = ({ navigation }: TProps) => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      name="Home"
      component={HomeScreen}
      options={{
        title: "Home",
        headerShown: false,
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

// News Stack
const NewsStack = createStackNavigator();
const NewsStackScreen = ({ navigation }: TProps) => (
  <NewsStack.Navigator>
    <HomeStack.Screen
      name="LiveTVScreen"
      component={LiveTVScreen}
      options={{
        title: "LiveTVScreen",
        headerShown: false,
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
  </NewsStack.Navigator>
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
  <ProfileStack.Navigator initialRouteName="Profile">
    <ProfileStack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        title: "Profile",
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
    <ProfileStack.Screen
      name="TestScreen"
      component={TestScreen}
      options={{
        title: "Test",
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
      name="MarketGroupListScreen"
      component={MarketGroupListScreen}
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

// Screen Stack
const ScreenStack = createStackNavigator();
const ScreenStackScreen = () => (
  <PositionStack.Navigator>
    <PositionStack.Screen
      name="ScreenListScreen"
      component={ScreenListScreen}
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
    <PositionStack.Screen
      name="NewScreenScreen"
      component={NewScreenScreen}
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
    <Drawer.Screen name="Debug" component={DebugScreen} />
    <Drawer.Screen name="Screen" component={ScreenStackScreen} />
    <Drawer.Screen name="News" component={NewsStackScreen} />
  </Drawer.Navigator>
);

// Root Stack
const RootStack = createStackNavigator();
const RootStackScreen = ({ userToken }: TProps) => {
  const coreState = useContext(CoreStateContext);
  return (
    <RootStack.Navigator headerMode="none">
      {coreState.state.isSilentSignInComplete == true ? (
        <>
          <RootStack.Screen
            name="App"
            component={DrawerScreen}
            options={{
              animationEnabled: false,
            }}
          />
          <RootStack.Screen
            name="WebViewScreen"
            component={WebViewScreen}
            options={{
              title: "Test",
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
        </>
      ) : (
        <RootStack.Screen
          name="Core"
          component={CoreStackScreen}
          options={{
            animationEnabled: false,
          }}
        />
      )}
    </RootStack.Navigator>
  );
};

const RootNavigation = () => {
  return (
    <NavigationContainer>
      <RootStackScreen />
    </NavigationContainer>
  );
};

export default RootNavigation;
