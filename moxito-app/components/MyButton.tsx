import React from 'react';
import { Button } from 'react-native-paper';
import CommonStyle from '../styles/CommonStyle';
import { COLORS } from '../themes/colors';
import useTheme from '../themes/ThemeProvider';

export default function MyButton({onPress, title, icon, style}: any) {
    const theme = useTheme();
    const commonStyle = CommonStyle(theme);

    return (
      <Button
        key={title}
        uppercase={false}
        contentStyle={{ height: 50 }}
        labelStyle={{color:COLORS.black}}
        style={[commonStyle.button, style]}
        onPress={onPress}
        icon={icon}
      >
        {title}
      </Button>
    )
}
