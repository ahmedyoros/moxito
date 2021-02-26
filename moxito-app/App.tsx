import React from 'react';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import './logs/IgnoreLogs';
import CheckLogin from './screens/CheckLogin';
import ChooseRole from './screens/ChooseRole';
import Login from './screens/Login';
import MainMenu from './screens/MainMenu';
import { ThemeProvider } from './themes/ThemeProvider';

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <AppearanceProvider>
      <ThemeProvider>
        <AppNavigator theme={isDarkMode ? 'dark' : 'light'} />
      </ThemeProvider>
    </AppearanceProvider>
  );
}

const navigator = createSwitchNavigator({
  CheckLogin: CheckLogin,
  NotLogged: createStackNavigator({
    ChooseRole: {
      screen: ChooseRole,
      navigationOptions: { headerShown: false },
    },
    Login: Login,
  }),
  Logged: MainMenu,
});

const AppNavigator = createAppContainer(navigator);
