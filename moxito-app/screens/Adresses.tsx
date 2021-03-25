import React from 'react';
import { View, Text, TouchableOpacity, ScrollView} from 'react-native';
import { List } from 'react-native-paper';
import Loading from '../components/Loading';
import CommonStyle from '../styles/CommonStyle';
import FavoriteStyle from '../styles/FavoriteStyle';
import useTheme from '../themes/ThemeProvider';
import House from '../assets/icons/house.svg';
import {
  hash,
  removeFavoriteAddress,
  useFavoriteAddresses,
} from '../backend/FavoriteManager';

export default function Adresses() {
  const [adresses, loading] = useFavoriteAddresses();

  const theme = useTheme();
  const commonStyle = CommonStyle(theme);
  const favoriteStyle = FavoriteStyle(theme);

  if (loading) return <Loading />;
  return (
    <View style={[favoriteStyle.container, {padding: 25, flex:1}]}>
      <House style={{ alignSelf: 'center', marginBottom: 20}} />
      <ScrollView>
      {adresses.map((a) => (
        <List.Item
          style={[
            {
              backgroundColor: theme.colors.surface,
              marginBottom: 5,
            },
            commonStyle.shadow,
          ]}
          key={hash(a)}
          title={a.city}
          description={a.street}
          right={(props) => (
            <>
              <TouchableOpacity onPress={() => removeFavoriteAddress(a)}>
                <List.Icon
                  {...props}
                  icon="close"
                  
                />
              </TouchableOpacity>   
            </>
          )}
        />
      ))}
      {adresses.length === 0 && (
        <Text style={favoriteStyle.text}>
          Il semblerait que vous n'ayez pas encore ajouté d’adresses à vos
          favoris
        </Text>
      )}
      </ScrollView>
    </View>
  );
}
