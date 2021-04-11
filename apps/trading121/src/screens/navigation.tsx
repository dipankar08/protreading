// We use the patterns defined in https://github.com/ReactNativeSchool/getting-started-react-navigation-v5/blob/master/App/index.js
import LoadingScreen from "./LoadingScreen";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AuthContext } from "../components/context";
import { SignUpScreen, SignInScreen, SplashScreen, SearchScreen, SearchScreen2, DetailsScreen, HomeScreen } from "./Screens";
import { ProfileScreen } from "./ProfileScreen";
import { PositionScreen } from "./PositionScreen";
import { MarketScreen } from "./MarketScreen";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// authstack
const AuthStack = createStackNavigator();
const AuthStackScreen = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen name="SignIn" component={SignInScreen} options={{ title: "Sign In" }} />
    <AuthStack.Screen name="CreateAccount" component={SignUpScreen} options={{ title: "Create Account" }} />
  </AuthStack.Navigator>
);

const HomeStack = createStackNavigator();
const HomeStackScreen = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen name="Home" component={HomeScreen} />
    <HomeStack.Screen name="Position" component={PositionScreen} />
    <HomeStack.Screen name="Market" component={MarketScreen} />
    <HomeStack.Screen
      name="Details"
      component={DetailsScreen}
      options={({ route }) => ({
        title: "Details",
      })}
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

// Profile
const ProfileStack = createStackNavigator();
const ProfileStackScreen = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen name="Profile" component={ProfileScreen} />
  </ProfileStack.Navigator>
);

// Button Tabs
const Tabs = createBottomTabNavigator();
const TabsScreen = () => (
  <Tabs.Navigator
    initialRouteName="Market"
    tabBarOptions={{
      activeTintColor: "#e91e63",
      keyboardHidesTabBar: true,
      showLabel: false,
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
      component={MarketScreen}
      options={{
        tabBarLabel: "Market",
        tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="trending-up" color={color} size={size} />,
      }}
    />
    <Tabs.Screen
      name="Position"
      component={PositionScreen}
      options={{
        tabBarLabel: "Position",
        tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="camera-iris" color={color} size={size} />,
      }}
    />
    <Tabs.Screen
      name="Profile"
      component={ProfileScreen}
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
  return (
    <RootStack.Navigator headerMode="none">
      {userToken ? (
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
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [userToken, setUserToken] = React.useState<string | null>(null);

  // define auth context
  const authContext = React.useMemo(() => {
    return {
      signIn: () => {
        setIsLoading(false);
        setUserToken("dipankar");
      },
      signUp: () => {
        setIsLoading(false);
        setUserToken("dipankar");
      },
      signOut: () => {
        setIsLoading(false);
        setUserToken(null);
      },
    };
  }, []);

  // define lifecyle
  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  });

  if (isLoading) {
    return <SplashScreen />;
  }
  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <RootStackScreen userToken={userToken} />
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default RootNavigation;
