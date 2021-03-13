import React from 'react';
import { View, Text } from 'react-native';
import { List } from 'react-native-paper';
import Loading from '../components/Loading';
import CommonStyle from '../styles/CommonStyle';
import FavoriteStyle from '../styles/FavoriteStyle';
import useTheme from '../themes/ThemeProvider';
import House from '../assets/icons/house.svg';
import { useFavoriteAddresses } from '../backend/FavoriteManager';

export default function Adresses() {
  const [adresses, loading] = useFavoriteAddresses();

  const theme = useTheme();
  const commonStyle = CommonStyle(theme);
  const favoriteStyle = FavoriteStyle(theme);

  if (loading) return <Loading />;
  return (
    <View style={favoriteStyle.container}>
      <House style={{ alignSelf: 'center' }} />
      <List.Section>
        {adresses.map((a) => (
          <List.Item
            style={[{
              backgroundColor: theme.colors.surface,
              marginBottom: 5,
            }, commonStyle.shadow]}
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
      {adresses.length === 0 && (
        <Text style={favoriteStyle.text}>
          Il semblerait que vous n'ayez pas encore ajouter d’adresses a vos
          favoris
        </Text>
      )}
    </View>
  );
}
