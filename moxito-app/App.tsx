import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import Chat from './components/Chat';
import CheckLogin from './components/CheckLogin';
import Login from './components/Login';

export default class App extends React.Component {
  render() {
    return <AppNavigator />;
  }
}

const navigator = createSwitchNavigator({
  CheckLogin: CheckLogin,
  Login: Login,
  Chat: Chat
})

const AppNavigator = createAppContainer(navigator);