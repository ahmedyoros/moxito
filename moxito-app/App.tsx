import React from 'react';

import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer } from 'react-navigation';

import Main from './components/Main';
import Chat from './components/Chat';

export default class App extends React.Component {
  render() {
    return <AppNavigator />;
  }
}

// Create the navigator
const navigator = createStackNavigator({
  Main: { screen: Main },
  Chat: { screen: Chat },
});

const AppNavigator = createAppContainer(navigator);