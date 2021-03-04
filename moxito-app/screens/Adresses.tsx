import React from 'react';
import { View, Text } from 'react-native';
import { List } from 'react-native-paper';
import Loading from '../components/Loading';
import useFavoritesAdresses from '../providers/AddressProvider';
import CommonStyle from '../styles/CommonStyle';
import FavoriteStyle from '../styles/FavoriteStyle';
import useTheme from '../themes/ThemeProvider';
import House from '../assets/icons/House.svg';

export default function Adresses() {
  const [adresses, loading] = useFavoritesAdresses();

  const theme = useTheme();
  const commonStyle = CommonStyle(theme);
  const favoriteStyle = FavoriteStyle(theme);

  if (loading) return <Loading />;
  return (
    <View style={favoriteStyle.container}>
      <House style={{ alignSelf: 'center'}} />
      <Text style={favoriteStyle.text}>Adresses Enregistrées</Text>
      <List.Section>
        {adresses.map((a) => (
          <List.Item style={{backgroundColor: theme.colors.onBackground, marginBottom: 5}}
            key={a.city + a.street}
            title={a.city}
            description={a.street}
            right={(props) => (
              <>
                <List.Icon {...props} icon="pencil" />
                <List.Icon {...props} icon="close" />
              </>
            )}
          />
        ))}
      </List.Section>
    </View>
  );
}
