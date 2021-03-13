import firebase from 'firebase/app';
import 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Headline, Portal, Snackbar, Subheading, Title } from 'react-native-paper';
import { AirbnbRating } from 'react-native-ratings';
import { getReviewFrom, setReview } from '../backend/ReviewManager';
import { updateCurrentUser } from '../backend/UserManager';
import Avatar from '../components/Avatar';
import MyButton from '../components/MyButton';
import { Role } from '../enums/Role';
import { UserStatus } from '../enums/Status';
import CommonStyle from '../styles/CommonStyle';
import useTheme from '../themes/ThemeProvider';
import { NavigationProps } from '../types/Props';
import { Race } from '../types/Race';
import { reviewList } from '../types/Review';
import { BaseUser, defaultPictureUrl, User } from '../types/User';
import { allNullOrUndefined } from '../utils/nullOrUndefined';

export default function UserReview({ navigation, route }: NavigationProps) {
  const race: Race = route.params!.race;
  const reviewer: User = route.params!.user;
  const reviewedRole = Role.opposite(reviewer.role);
  const reviewed: BaseUser = race[reviewedRole]!;
  const reviews = reviewList[reviewedRole];

  const [ratings, setRatings] = useState(
    new Array<number | null>(reviews.length).fill(null)
  );
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [review, loading] = getReviewFrom(reviewer.currentRaceId!, reviewed.id);
  
  useEffect(() => {
    navigation.setOptions({
      title: 'Noter ' + reviewed.displayName,
    });
  });

  useEffect(() => {
    if(loading) return;
    if(review) setRatings(review.ratings);
  }, [loading])

  const submit = () => {
    if (!allNullOrUndefined(ratings)) {
      setReview(
        reviewer.currentRaceId!,
        reviewed.id,
        ratings,
        () => setSnackbarVisible(true)
      );
    } else {
      setSnackbarVisible(true);
    }
  };

  const seeProfile = () => navigation.navigate('Profile', {user:reviewed});

  const theme = useTheme();
  const commonStyle = CommonStyle(theme);
  return (
    <View>
      <Avatar
        size={100}
        imageUrl={(reviewed && reviewed.photoURL) || defaultPictureUrl}
        onPress={seeProfile}
      />
      <MyButton icon="account-box" title="Profile" onPress={seeProfile} />
      <View>
        <Title style={{fontStyle:'italic', marginLeft:30}}>
          Qu'avez vous pensez du {Role.toString(reviewedRole)}?</Title>
        {reviewList[reviewedRole].map((r, idx) => (
          <View key={r}>
            <Text style={[commonStyle.text, {fontWeight: 'bold', margin:10, marginLeft:30}]}>{r}</Text>
            <AirbnbRating
              showRating={false}
              defaultRating={ratings[idx] || 0}
              selectedColor={theme.colors.primary}
              onFinishRating={(rating) => {
                let newRatings = ratings;
                newRatings[idx] = rating;
                setRatings(newRatings);
              }}
            />
          </View>
        ))}
      </View>
      <MyButton title="Valider" onPress={submit} />
      <Portal>
        <Snackbar
          theme={{ colors: { surface: theme.colors.text } }}
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          action={{
            label: "Retour à l'Accueil",
            onPress: () =>
              updateCurrentUser({
                status: UserStatus.idle,
                currentRaceId: firebase.firestore.FieldValue.delete(),
              }),
          }}
        >
          {allNullOrUndefined(ratings)
            ? "Ne pas laisser d'avis ?"
            : "Merci pour l'avis !"}
        </Snackbar>
      </Portal>
    </View>
  );
}
