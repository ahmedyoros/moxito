import firebase from 'firebase/app';
import 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { HelperText, Snackbar, TextInput } from 'react-native-paper';
import useCurrentUser, { updateCurrentUser } from '../backend/UserManager';
import { BarTitle } from '../components/BarTitle';
import KeyboardAvoid from '../components/KeyboardAvoid';
import Loading from '../components/Loading';
import MyButton from '../components/MyButton';
import { useDidMountEffect } from '../components/MyHooks';
import UploadImage from '../components/UploadImage';
import { Role } from '../enums/Role';
import useTheme from '../themes/ThemeProvider';
import { NavigationProps } from '../types/Props';

export default function Profile({ navigation, route }: NavigationProps) {
  const [user, userLoading] = useCurrentUser();
  const newUser: boolean = route.params!.newUser;
  const fireUser = firebase.auth().currentUser!;
  const theme = useTheme();

  const [presentation, setPresentation] = useState('');
  const [presenationError, setPresenationError] = useState(false);

  const [motoModel, setMotoModel] = useState('');
  const [motoModelError, setMotoModelError] = useState(false);

  const [immatriculation, setImmatriculation] = useState('');
  const [immatriculationError, setImmatriculationError] = useState(false);

  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const checkPresentationError = () => setPresenationError(presentation.trim() === '' && user.role === Role.Driver);
  useDidMountEffect(checkPresentationError, [presentation]);
  const checkMotoModelError = () => setMotoModelError(motoModel.trim() === '');
  useDidMountEffect(checkMotoModelError, [motoModel]);
  const checkImmatriculationError = () => setImmatriculationError(immatriculation.trim() === '');
  useDidMountEffect(checkImmatriculationError, [immatriculation]);

  useEffect(() => {
    if (!userLoading) {
      user.presentation && setPresentation(user.presentation);
      user.motoModel && setMotoModel(user.motoModel);
      user.immatriculation && setImmatriculation(user.immatriculation);
    }
  }, [userLoading]);

  const updatePhotoUrl = (photoURL: string) => {
    fireUser.updateProfile({
      photoURL: photoURL,
    });
  };

  const submit = () => {
    const userData: any = {
      presentation: presentation,
    };
    if (user.role == Role.Driver) {
      checkPresentationError();
      checkImmatriculationError();
      checkMotoModelError();
      if (presenationError || motoModelError || immatriculationError) return;

      userData.motoModel = motoModel;
      userData.immatriculation = immatriculation;
    }
    updateCurrentUser(userData, () => setSnackbarVisible(true));
  };

  if (userLoading) return <Loading />;
  return (
    <KeyboardAvoid>
      {newUser && <BarTitle title={`Bienvenue ${user.displayName} !`} />}
      <UploadImage
        avatar={true}
        imageUrl={user.photoURL}
        setImageUrl={updatePhotoUrl}
      />
      <TextInput
        multiline={true}
        numberOfLines={5}
        label="Présentation"
        value={presentation}
        onChangeText={setPresentation}
      />
      <HelperText type="error" visible={presenationError}>
        Ce champ est requis
      </HelperText>
      {user.role == Role.Driver && (
        <View>
          <TextInput
            label="Modèle de votre moto"
            value={motoModel}
            onChangeText={setMotoModel}
          />
          <HelperText type="error" visible={motoModelError}>
            Ce champ est requis.
          </HelperText>
          <TextInput
            label="Plaque d'immatriculation"
            value={immatriculation}
            onChangeText={setImmatriculation}
          />
          <HelperText type="error" visible={immatriculationError}>
            Ce champ est requis.
          </HelperText>
        </View>
      )}
      <MyButton title="Valider" onPress={submit} />
      <Snackbar
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
