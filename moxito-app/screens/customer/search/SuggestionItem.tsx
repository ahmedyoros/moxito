import { Entypo } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import useTheme from '../../../themes/ThemeProvider';

const SuggestionItem = ({ data }: any) => {
  const theme = useTheme();
  return (
    <View style={{ flexDirection: 'row' }}>
      <View
        style={{
          backgroundColor: '#a2a2a2',
          padding: 4,
          borderRadius: 50,
          marginRight: 10,
        }}
      >
        {data.description === 'Home' ? (
          <Entypo name="home" siz={20} color={'white'} />
        ) : (
          <Entypo name="location-pin" siz={20} color={'white'} />
        )}
      </View>
      <Text style={{ color: theme.colors.text }}>
        {data.description || data.vicinity}
      </Text>
    </View>
  );
};

export default SuggestionItem;
