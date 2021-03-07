import React from 'react';
import { View, Text } from 'react-native';
import Loading from '../components/Loading';
import useFavoritesDrivers from '../backend/DriversProvider';
import CommonStyle from '../styles/CommonStyle';
import FavoriteStyle from '../styles/FavoriteStyle';
import useTheme from '../themes/ThemeProvider';
import Helmet from '../assets/icons/helmet.svg';
import { List } from 'react-native-paper';

export default function Drivers() {
  const [drivers, loading] = useFavoritesDrivers();

  const theme = useTheme();
  const commonStyle = CommonStyle(theme);
  const favoriteStyle = FavoriteStyle(theme);

  if (loading) return <Loading />;
  return (
    <View style={favoriteStyle.container}>
      <Helmet style={{ alignSelf: 'center' }} />
      <List.Section>
        {drivers.map((d) => (
          <List.Item
            style={[{
              backgroundColor: theme.colors.surface,
              marginBottom: 5,
            }, commonStyle.shadow]}
            key={d.id}
            title={d.displayName}
            description={'XXX courses passées'}
            right={(props) => (
              <>
                <List.Icon {...props} icon="circle" />
              </>
            )}
          />
        ))}
      </List.Section>
      {drivers.length === 0 && (
        <Text style={favoriteStyle.text}>
          Il semblerait que vous n'ayez pas encore de chauffeurs favoris
        </Text>
      )}
    </View>
  );
}
