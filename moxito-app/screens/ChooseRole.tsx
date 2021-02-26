import React from 'react';
import { ImageBackground, Text, View } from 'react-native';
import Button from 'react-native-button';
import Moxito from '../assets/logos/moxito-w.svg';
import ChooseRoleStyle from '../styles/ChooseRoleStyle';
import { COLORS } from '../themes/colors';
import CommonStyle from '../styles/CommonStyle';
import LoginStyle from '../styles/LoginStyle';
import { useTheme } from '../themes/ThemeProvider';
import { NavigationProp } from '../types/navigation';
import { Role } from '../types/role';

export default function ChooseRole({navigation}: NavigationProp) {
  const theme = useTheme();
  const commonStyle = CommonStyle(theme);
  const chooseRoleStyle = ChooseRoleStyle(theme);

  return (
    <ImageBackground
      source={require('../assets/logos/bg-logos.png')}
      style={chooseRoleStyle.backgroundImage}
      imageStyle={{ resizeMode: 'repeat' }}
    >
      <View style={chooseRoleStyle.container}>
        <Moxito width={500} style={{
          marginBottom:0
        }} />

        <Text
          style={{
            color: COLORS.white,
            fontSize: 20,
            marginBottom: 40,
          }}
        >
          Se déplacer autrement
        </Text>

        <Button
          style={commonStyle.button}
          onPress={() =>
            navigation.navigate('Login', { register: true, role: Role.Driver })
          }
        >
          Je suis chauffeur
        </Button>

        <Button
          style={commonStyle.button}
          onPress={() =>
            navigation.navigate('Login', { register: true, role: Role.Customer })
          }
        >
          Je cherche un Taxi-moto
        </Button>

        <Button
          style={commonStyle.button}
          onPress={() => navigation.navigate('Login')}
        >
          J'ai déjà un compte
        </Button>
      </View>
    </ImageBackground>
  );
}
