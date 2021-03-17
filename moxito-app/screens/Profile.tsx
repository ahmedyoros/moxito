import React, { useEffect, useState } from 'react';
import { View, Image, Dimensions} from 'react-native';
import { HelperText, Snackbar, TextInput } from 'react-native-paper';
import {getCurrentUser, getFireUser, updateCurrentUser } from '../backend/UserManager';
import { BarTitle } from '../components/BarTitle';
import KeyboardAvoid from '../components/KeyboardAvoid';
import Loading from '../components/Loading';
import MyButton from '../components/MyButton';
import { useDidMountEffect } from '../components/MyHooks';
import UploadImage from '../components/UploadImage';
import { Role } from '../enums/Role';
import useTheme from '../themes/ThemeProvider';
import { NavigationProps } from '../types/Props';
import Carousel from 'react-native-snap-carousel';
import { scrollInterpolator, animatedStyles } from '../utils/animations';
import { getImage } from '../utils/getImage';
import { COLORS } from '../themes/colors';



export default function Profile({ navigation, route }: NavigationProps) {
  const [user, userLoading] = getCurrentUser();
  const newUser: boolean = route.params!.newUser;
  const fireUser = getFireUser();
  const theme = useTheme();
  const carouselItems = ["1", "2", "3", "4"];
  const [activeIndex, setActiveIndex] = useState(0);

  const SLIDER_WIDTH = Dimensions.get('window').width;
  const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);
  const ITEM_HEIGHT = Math.round(ITEM_WIDTH * 3 / 4);


  const [presentation, setPresentation] = useState('');
  const [presenationError, setPresenationError] = useState(false);


  const [motoModel, setMotoModel] = useState('');
  const [motoModelError, setMotoModelError] = useState(false);

  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const checkPresentationError = () => setPresenationError(presentation.trim() === '' && user.role === Role.Driver);
  useDidMountEffect(checkPresentationError, [presentation]);
  const checkMotoModelError = () => setMotoModelError(motoModel.trim() === '');
  useDidMountEffect(checkMotoModelError, [motoModel]);
  useEffect(() => {
    if (!userLoading) {
      user.presentation && setPresentation(user.presentation);
      user.motoModel && setMotoModel(user.motoModel);
    }
  }, [userLoading]);

  const renderItem =({item, index}) => {
    return (
      <View style={{backgroundColor: COLORS.orange, borderRadius: 10}}>
        <Image
            source={getImage(item)}
        />
      </View>
    )
  };


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
      checkMotoModelError();
      if (presentation === '' || motoModel === '') return;

      userData.motoModel = motoModel;

    }
    updateCurrentUser(userData, () => setSnackbarVisible(true));
  };

  

  if (userLoading) return <Loading />;
  return (
    <KeyboardAvoid>
      {newUser && <BarTitle title={`Bienvenue ${user.firstname} !`} />}
      <View style={{
        marginTop: 15
      }} >
        <UploadImage
          avatar={true}
          imageUrl={user.photoURL}
          setImageUrl={updatePhotoUrl}
        />
      </View>
      
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
          <Carousel
            data={carouselItems}
            renderItem={renderItem}
            sliderWidth={SLIDER_WIDTH}
            itemWidth={ITEM_WIDTH}
            inactiveSlideShift={0}
            snapToEnd
          
            onSnapToItem = { 
              index => {
                setActiveIndex(index);
                setMotoModel((index + 1) + "") 
              }
            }
            scrollInterpolator={scrollInterpolator}
            slideInterpolatedStyle={animatedStyles}
            useScrollView={true}          
          />
      
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
