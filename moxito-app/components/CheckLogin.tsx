import firebase from 'firebase';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

type Props = {
  navigation: NavigationScreenProp<any,any>
};

class CheckLogin extends React.Component<Props> {

  componentDidMount() {
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn = () => {
    firebase.auth().onAuthStateChanged(
      (user: any) => {
        console.log('AUTH STATE CHANGED CALLED ')
        if (user) {
          this.props.navigation.navigate('Chat');
        } else {
          this.props.navigation.navigate('Login');
        }
      }
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
}
export default CheckLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
