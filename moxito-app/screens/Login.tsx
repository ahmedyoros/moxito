import * as Google from 'expo-google-app-auth';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import React from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FacebookIcon from '../assets/logos/facebook.svg';
import GoogleIcon from '../assets/logos/google.svg';
import TwitterIcon from '../assets/logos/twitter.svg';
import { BarTitle } from '../components/BarTitle';
import { firebaseConfig } from '../config';
import CommonStyle from '../styles/CommonStyle';
import LoginStyle from '../styles/LoginStyle';
import { useTheme } from '../themes/ThemeProvider';
import { NavigationProp } from '../types/navigation';
import { Role } from '../types/role';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

Login.navigationOptions = ({ navigation }: NavigationProp) => ({
  title: navigation.getParam('register')
    ? `S'inscrire comme ${Role.toString(navigation.getParam('role'))}`
    : 'Se connecter',
});

function Login({ navigation }: NavigationProp) {
  const register: boolean = navigation.getParam('register');
  const title = register ? "S'inscrire" : 'Se connecter';

  const signInWithGoogleAsync = async () => {
    const result: Google.LogInResult = await Google.logInAsync({
      iosClientId: `17884074050-gegh9frsq9tdlgldqv5efobjpjfouvje.apps.googleusercontent.com`,
      androidClientId: `17884074050-jusnqenblbmkshr2n7ggickk72domvhs.apps.googleusercontent.com`,
      iosStandaloneAppClientId: `17884074050-2ssuqgak04cp89ed81pmlcv3q0pkaikq.apps.googleusercontent.com`,
      androidStandaloneAppClientId: `17884074050-m260r9e39hcqd4cftloakvv98sba78v8.apps.googleusercontent.com`,
    });

    if (result.type === 'success') {
      console.log('Google Auth Response', result.user);
      var unsubscribe = firebase
        .auth()
        .onAuthStateChanged(() => {
          unsubscribe();
          signIn(firebase.auth.GoogleAuthProvider.credential(
            result.idToken,
            result.accessToken
          ));
        });
    }
  };

  const signInWithFacebookAsync = () => {
    throw new Error('Method not implemented.');
  };
  const signInWithTwitterAsync = () => {
    throw new Error('Method not implemented.');
  };

  const signIn = (credential: firebase.auth.OAuthCredential) => {
    firebase
      .auth()
      .signInWithCredential(credential)
      .then((result) => {
        const user = result.user!;
        console.log('user signed in ');
        if (result.additionalUserInfo!.isNewUser) {
          console.log(`${user.displayName} is a new user`);

          const userProfile: any = result.additionalUserInfo!.profile!;
          firebase
            .database()
            .ref('/users/' + user.uid)
            .set({
              email: user.email,
              profile_picture: userProfile.picture,
              first_name: userProfile.given_name,
              last_name: userProfile.family_name || null,
              created_at: Date.now(),
            });

          firebase
            .firestore()
            .collection('user')
            .doc(user.uid)
            .set({
              role: navigation.getParam('role'),
            });
        } else {
          console.log(`${user.displayName} is a known user`);
          firebase
            .database()
            .ref('/users/' + user.uid)
            .update({
              last_logged_in: Date.now(),
            });
        }
      });
  }

  const theme = useTheme();
  const commonStyle = CommonStyle(theme);
  const loginStyle = LoginStyle(theme);

  return (
    <View style={commonStyle.container}>
      <BarTitle title={title + ' avec'} />
      <View style={loginStyle.providerIcons}>
        <TouchableOpacity
          onPress={() => signInWithGoogleAsync()}
          style={[loginStyle.providerButton, commonStyle.shadow]}
        >
          <Text>
            <GoogleIcon width={30} height={30} />
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => signInWithFacebookAsync()}
          style={[loginStyle.providerButton, commonStyle.shadow]}
        >
          <Text>
            <FacebookIcon width={30} height={30} />
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => signInWithTwitterAsync()}
          style={[loginStyle.providerButton, commonStyle.shadow]}
        >
          <Text>
            <TwitterIcon width={30} height={30} />
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  
}

export default Login;
