import { Entypo } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { COLORS } from '../../../themes/colors';
import useTheme from '../../../themes/ThemeProvider';

type Props = {
  data: any;
  suggestCurrentLocation: boolean;
  currentInput: string;
  index: number;
};

const SuggestionItem = ({
  data,
  suggestCurrentLocation,
  currentInput,
  index,
}: Props) => {
  const theme = useTheme();
  return (
    <View style={{ flexDirection: 'row' }}>
      <View
        style={{
          backgroundColor: theme.colors.text,
          padding: 3,
          borderRadius: 50,
          marginRight: 5,
        }}
      >
        <Entypo
          name={
            currentInput != '' ? 'location-pin' : suggestCurrentLocation && index == 0 ? 'home' : 'star'
          }
          size={18}
          color={COLORS.orange}
        />
      </View>
      <Text style={{ color: theme.colors.text }}>
        {data.description || data.vicinity}
      </Text>
    </View>
  );
};

export default SuggestionItem;
