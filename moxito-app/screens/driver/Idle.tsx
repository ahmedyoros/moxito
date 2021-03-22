import Slider from '@react-native-community/slider';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { updateCurrentUser } from '../../backend/UserManager';
import { BarTitle } from '../../components/BarTitle';
import MyButton from '../../components/MyButton';
import { UserStatus } from '../../enums/Status';
import CommonStyle from '../../styles/CommonStyle';
import useTheme from '../../themes/ThemeProvider';
import { Pos, toPos } from '../../types/Pos';
import { UserProps } from '../../types/Props';
import * as Location from 'expo-location';
import usePermissions from 'expo-permissions-hooks';

export default function Idle({ user }: UserProps) {
  const [radius, setRadius] = useState(user.searchRadius || 100);
  const { isGranted, ask } = usePermissions('LOCATION');
  const [pos, setPos] = useState<Pos | undefined>(user.pos);

  useEffect(() => {
    if (isGranted) {
      Location.getCurrentPositionAsync().then((location) => setPos(toPos(location)))
    } else ask();
  }, [isGranted]);

  const theme = useTheme();
  const commonStyle = CommonStyle(theme);
  return (
    <View style={[commonStyle.container, { alignItems: 'center' }]}>
      <BarTitle title="Vous êtes hors-ligne" />
      {pos && (
        <>
          <Slider
            style={{ width: '80%', height: 40 }}
            minimumValue={1}
            step={1}
            maximumValue={200}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.text}
            value={radius}
            onValueChange={setRadius}
          />
          <MyButton
            title={`Me rendre disponible`}
            onPress={() => {
              updateCurrentUser({
                status: UserStatus.searching,
                searchRadius: radius,
                pos: pos,
              });
            }}
          />
        </>
      )}
      <Text style={commonStyle.text}>dans un rayon de {radius} Km</Text>
    </View>
  );
}
