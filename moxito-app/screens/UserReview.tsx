import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Snackbar } from 'react-native-paper';
import {
  addFavoriteDriver,
  isFavoriteDriver,
  removeFavoriteDriver,
} from '../backend/FavoriteManager';
import Avatar from '../components/Avatar';
import MyButton from '../components/MyButton';
import { Role } from '../enums/Role';
import CommonStyle from '../styles/CommonStyle';
import useTheme from '../themes/ThemeProvider';
import { BaseUser, defaultPictureUrl, User } from '../types/User';
import { AntDesign } from '@expo/vector-icons';
import { UserStatus } from '../enums/Status';
import { updateCurrentUser } from '../backend/UserManager';
import { COLORS } from '../themes/colors';
import { Race } from '../types/Race';

export default function UserReview({ navigation, route }: any) {
  const race: Race = route.params!.race;
  const reviewer: User = route.params!.user;
  const user: BaseUser =
    reviewer.role === Role.Driver ? race.customer : race.driver!;

  const [favorite, loading] = isFavoriteDriver(user.id);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [favoriteDriver, setFavoriteDriver] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (favorite) setFavoriteDriver(true);
  }, [loading]);

  const addFavorite = () => {
    addFavoriteDriver(user);
    setFavoriteDriver(true);
  };

  const removeFavorite = () => {
    removeFavoriteDriver(user.id);
    setFavoriteDriver(false);
  };

  const submit = () => {
    setSnackbarVisible(true);
  };

  useEffect(() => {
    navigation.setOptions({
      title: 'Noter ' + user.displayName,
    });
  });

  const theme = useTheme();
  const commonStyle = CommonStyle(theme);
  return (
    <View style={commonStyle.container}>
      <Avatar
        size={100}
        imageUrl={(user && user.photoURL) || defaultPictureUrl}
      />
      <MyButton icon="account-box" title="Profile" onPress={() => {}} />
      {reviewer.role == Role.Customer && (
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          {favoriteDriver ? (
            <>
              <AntDesign
                name="star"
                size={50}
                color={theme.colors.primary}
                style={{ marginTop: 15 }}
              />
              <MyButton
                title={`retirer de vos favoris`}
                onPress={removeFavorite}
              />
            </>
          ) : (
            <>
              <AntDesign
                name="staro"
                size={50}
                color={theme.colors.primary}
                style={{ marginTop: 15 }}
              />
              <MyButton title={`ajouter à vos favoris`} onPress={addFavorite} />
            </>
          )}
        </View>
      )}
      <Text style={commonStyle.text}>
        TODO : pouvoir noter le chauffeur / client
      </Text>
      <Snackbar
        theme={{ colors: { surface: theme.colors.text } }}
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        action={{
          label: "Retour à l'Accueil",
          onPress: () => updateCurrentUser({ status: UserStatus.idle }),
        }}
      >
        Merci pour l'avis !
      </Snackbar>
      <MyButton title="Valider" onPress={submit} />
    </View>
  );
}
