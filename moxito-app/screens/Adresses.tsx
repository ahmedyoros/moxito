import React from 'react';
import { View, Text } from 'react-native';
import { List } from 'react-native-paper';
import Loading from '../components/Loading';
import useFavoritesAdresses from '../providers/AddressProvider';
import CommonStyle from '../styles/CommonStyle';
import useTheme from '../themes/ThemeProvider';

export default function Adresses() {
  const [adresses, loading] = useFavoritesAdresses();

  const theme = useTheme();
  const commonStyle = CommonStyle(theme);

  if (loading) return <Loading />;
  return (
    <View style={commonStyle.container}>
      <Text style={commonStyle.text}>Voici mes adresses</Text>
      {adresses.map((a) => (
        <List.Item
          key={a.city + a.street}
          title={a.city}
          description={a.street}
          left={(props) => <List.Icon {...props} icon="folder" />}
        />
      ))}
    </View>
  );
}
