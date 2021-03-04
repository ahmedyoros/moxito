import firebase from 'firebase';
import React from 'react';
import { View } from 'react-native';
import { BarTitle } from '../components/BarTitle';
import Loading from '../components/Loading';
import MyButton from '../components/MyButton';
import useUser from '../components/UserProvider';
import CommonStyle from '../styles/CommonStyle';
import useTheme from '../themes/ThemeProvider';

export default function MainMenu() {
  const [user, loading] = useUser();

  const theme = useTheme();
  const commonStyle = CommonStyle(theme);
  
  if(loading) return <Loading />;
  return (
    <View style={commonStyle.container}>
      <BarTitle title={'Bonjour ' + user.displayName} />
    </View>
  );
}
