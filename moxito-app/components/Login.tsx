import * as Google from 'expo-google-app-auth';
import firebase from 'firebase';
import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { firebaseConfig } from '../config';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

class Login extends React.Component {

  isUserEqual = (googleUser: Google.GoogleUser, firebaseUser: firebase.User | null) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i]!.providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i]!.uid === googleUser.id!
        ) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  };

  onSignIn = (googleUser: Google.GoogleUser, accessToken: string, idToken: string) => {
    console.log('Google Auth Response', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged(
      (firebaseUser: firebase.User | null) => {
        unsubscribe();
        // Check if we are already signed-in Firebase with the correct user.
        if (!this.isUserEqual(googleUser, firebaseUser)) {
          // Build Firebase credential with the Google ID token.
          var credential = firebase.auth.GoogleAuthProvider.credential(
            idToken, accessToken
          );
          // Sign in with credential from the Google user.
          firebase
            .auth()
            .signInWithCredential(credential)
            .then(function(result) {
              console.log('user signed in ');
              if (result.additionalUserInfo!.isNewUser) {
                const userProfile: any = result.additionalUserInfo!.profile!;
                firebase
                  .database()
                  .ref('/users/' + result.user!.uid)
                  .set({
                    gmail: result.user!.email,
                    profile_picture: userProfile.picture,
                    first_name: userProfile.given_name,
                    last_name: userProfile.family_name,
                    created_at: Date.now()
                  });
              } else {
                firebase
                  .database()
                  .ref('/users/' + result.user!.uid)
                  .update({
                    last_logged_in: Date.now()
                  });
              }
            })
            .catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              // ...
            });
        } else {
          console.log('User already signed-in Firebase.');
        }
      }
    );
  };

  signInWithGoogleAsync = async () => {
    const result: Google.LogInResult = await Google.logInAsync({
      iosClientId: `17884074050-gegh9frsq9tdlgldqv5efobjpjfouvje.apps.googleusercontent.com`,
      androidClientId: `17884074050-jusnqenblbmkshr2n7ggickk72domvhs.apps.googleusercontent.com`,
      iosStandaloneAppClientId: `17884074050-2ssuqgak04cp89ed81pmlcv3q0pkaikq.apps.googleusercontent.com`,
      androidStandaloneAppClientId: `17884074050-m260r9e39hcqd4cftloakvv98sba78v8.apps.googleusercontent.com`,
    });
    
    if (result.type === 'success') {
      this.onSignIn(result.user, result.accessToken!, result.idToken!);
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <Button
          title="Sign In With Google"
          onPress={() => this.signInWithGoogleAsync()}
        />
      </View>
    );
  }
}
export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
