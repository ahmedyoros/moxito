import React, { useEffect, useState } from 'react';
import { Dimensions, Image, View } from 'react-native';
import { HelperText, Snackbar, TextInput } from 'react-native-paper';
import Carousel from 'react-native-snap-carousel';
import {
  getCurrentUser,
  getFireUser,
  updateCurrentUser,
} from '../backend/UserManager';
import { BarTitle } from '../components/BarTitle';
import KeyboardAvoid from '../components/KeyboardAvoid';
import Loading from '../components/Loading';
import MyButton from '../components/MyButton';
import UploadImage from '../components/UploadImage';
import { Role } from '../enums/Role';
import useTheme from '../themes/ThemeProvider';
import { NavigationProps } from '../types/Props';
import { useDidMountEffect } from '../utils/hooks';
import { getModelImage } from '../utils/motoModel';

export default function Profile({ navigation, route }: NavigationProps) {
  const [user, userLoading] = getCurrentUser();
  const newUser: boolean = route.params!.newUser;
  const fireUser = getFireUser();
  const theme = useTheme();

  const SLIDER_WIDTH = Dimensions.get('window').width;
  const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.55);

  const [presentation, setPresentation] = useState('');
  const [presenationError, setPresenationError] = useState(false);

  const [motoModel, setMotoModel] = useState(0);

  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const checkPresentationError = () =>
    setPresenationError(
      presentation.trim() === '' && user.role === Role.Driver
    );
  useDidMountEffect(checkPresentationError, [presentation]);

  useEffect(() => {
    if (!user) return;
    setPresentation(user.presentation || '');
    setMotoModel(user.motoModel || 0);
  }, [userLoading]);

  const updatePhotoUrl = (photoURL: string) =>
    fireUser.updateProfile({ photoURL: photoURL });

  const submit = () => {
    const userData: any = {
      presentation: presentation,
    };
    if (user.role == Role.Driver) {
      checkPresentationError();
      if (presentation.trim() === '') return;

      userData.motoModel = motoModel;
    }
    updateCurrentUser(userData, () => setSnackbarVisible(true));
  };

  if (userLoading) return <Loading />;
  return (
    <KeyboardAvoid>
      {newUser && <BarTitle title={`Bienvenue ${user.firstname} !`} />}
      <View style={{ marginTop: 15 }}>
        <UploadImage
          avatar={true}
          imageUrl={user.photoURL}
          setImageUrl={updatePhotoUrl}
        />
      </View>

      <TextInput
        key="presentation"
        multiline={true}
        numberOfLines={5}
        label="Présentation"
        value={presentation}
        onChangeText={setPresentation}
      />
      <HelperText
        key="presentationError"
        type="error"
        visible={presenationError}
      >
        Ce champ est requis
      </HelperText>
      {user.role == Role.Driver && (
        <View>
          <Carousel
            style={{ alignItems: 'center' }}
            data={Array.from(Array(4).keys())}
            renderItem={({ item }: any) => (
              <Image source={getModelImage(item)} />
            )}
            sliderWidth={SLIDER_WIDTH}
            itemWidth={ITEM_WIDTH}
            inactiveSlideShift={0}
            onSnapToItem={(index) => setMotoModel(index)}
            initialScrollIndex={motoModel}
          />
        </View>
      )}
      <MyButton title="Valider" onPress={submit} />
      <Snackbar
        key="snackbarSubmit"
        theme={{ colors: { surface: theme.colors.text } }}
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        action={{
          label: "Retour à l'Accueil",
          onPress: () => navigation.navigate('Ma course'),
        }}
      >
        Profile sauvegardé !
      </Snackbar>
    </KeyboardAvoid>
  );
}
