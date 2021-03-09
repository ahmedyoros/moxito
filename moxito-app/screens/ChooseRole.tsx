import React from 'react';
import { ImageBackground, Text, View } from 'react-native';
import Moxito from '../assets/logos/moxito-w.svg';
import MyButton from '../components/MyButton';
import { Role } from '../enums/Role';
import CommonStyle from '../styles/CommonStyle';
import MoxitoStyle from '../styles/MoxitoStyle';
import useTheme from '../themes/ThemeProvider';
import { NavigationProps } from '../types/Props';

export default function ChooseRole({ navigation }: NavigationProps) {
  const theme = useTheme();
  const commonStyle = CommonStyle(theme);
  const moxitoStyle = MoxitoStyle(theme);

  return (
    <ImageBackground
      source={require('../assets/logos/bg-logos.png')}
      style={moxitoStyle.backgroundImage}
      imageStyle={{ resizeMode: 'repeat' }}
    >
      <View style={moxitoStyle.container}>
        <Moxito
          width={500}
          style={{
            marginBottom: 0,
          }}
        />

        <Text style={[moxitoStyle.text, { marginBottom: 40 }]}>
          Se déplacer autrement
        </Text>

        <MyButton
          onPress={() =>
            navigation.navigate('Login', { register: true, role: Role.Driver })
          }
          title="Je suis chauffeur"
        />

        <MyButton
          onPress={() =>
            navigation.navigate('Login', {
              register: true,
              role: Role.Customer,
            })
          }
          title="Je cherche un Taxi-moto"
        />

        <MyButton
          onPress={() => navigation.navigate('Login', { register: false })}
          title="J'ai déjà un compte"
        />
      </View>
    </ImageBackground>
  );
}
