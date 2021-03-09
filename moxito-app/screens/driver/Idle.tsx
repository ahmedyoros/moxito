import React from 'react';
import { View } from 'react-native';
import { updateCurrentUser } from '../../backend/UserManager';
import { BarTitle } from '../../components/BarTitle';
import MyButton from '../../components/MyButton';
import { UserStatus } from '../../enums/Status';
import CommonStyle from '../../styles/CommonStyle';
import useTheme from '../../themes/ThemeProvider';

export default function Idle() {
  const theme = useTheme();
  const commonStyle = CommonStyle(theme);
  return (
    <View style={commonStyle.container}>
      <BarTitle title="Vous êtes actuellement hors-ligne" />
      <MyButton title="Ne rendre disponible" onPress={() => updateCurrentUser({status:UserStatus.searching})} />
    </View>
  );
}
