import React from 'react';
import { useColorScheme } from 'react-native-appearance';
import { Provider as PaperProvider } from 'react-native-paper';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import './logs/IgnoreLogs';
import CheckLogin from './screens/CheckLogin';
import ChooseRole from './screens/ChooseRole';
import Login from './screens/Login';
import MainMenu from './screens/MainMenu';
import useTheme from './themes/ThemeProvider';

export default function App() {
  return (
    <PaperProvider theme={useTheme()}>
      <AppNavigator theme={useColorScheme()} />
    </PaperProvider>
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
