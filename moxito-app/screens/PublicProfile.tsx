import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { getAvgRating as getAvgRatings } from '../backend/ReviewManager';
import { getBaseUser, getFullUser } from '../backend/UserManager';
import Avatar from '../components/Avatar';
import Loading from '../components/Loading';
import CommonStyle from '../styles/CommonStyle';
import useTheme from '../themes/ThemeProvider';
import { NavigationProps } from '../types/Props';
import { BaseUser, User } from '../types/User';
import { AirbnbRating } from 'react-native-ratings';
import { average } from '../utils/array';
import { Role } from '../enums/Role';
import { capitalize } from 'lodash';
import { reviewList } from '../types/Review';
import { Divider, Headline, Paragraph as PaperText } from 'react-native-paper';
import MotoIcon from '../assets/motos/moto-1.svg';

export default function PublicProfile({ navigation, route }: NavigationProps) {
  const baseUser: BaseUser = route.params?.user || getBaseUser();

  const [user, userLoading] = getFullUser(baseUser);
  const [reviewsCount, ratings, ratingsLoading] = getAvgRatings(baseUser.id);

  useEffect(() => {
    if(!route.params) return;
    navigation.setOptions({
      title: 'Profile de ' + baseUser.displayName,
    });
  });

  const theme = useTheme();
  const commonStyle = CommonStyle(theme);

  if (userLoading || ratingsLoading) return <Loading />;  
  return (
    <View style={commonStyle.container}>
      <View
        style={{
          marginTop: 20,
          marginLeft: 30,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Avatar imageUrl={user.photoURL} size={120} />
        <View style={{ flexDirection: 'column', flexShrink: 1 }}>
          <AirbnbRating
            isDisabled
            size={30}
            showRating={false}
            selectedColor={theme.colors.primary}
            defaultRating={average(ratings) || 0}
          />
          <Text style={[commonStyle.text, { textAlign: 'center' }]}>
            {reviewsCount === 0 ? 'aucun' : reviewsCount} avis reçu
            {reviewsCount > 1 && 's'}
          </Text>
          <Text
            style={[
              commonStyle.text,
              { marginVertical: 10, textAlign: 'center' },
            ]}
          >
            {capitalize(Role.toString(user.role))} mOxitO depuis le{' '}
            {new Date(user.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <View
          style={{
            flexDirection: 'column',
            width: '40%',
            borderColor: theme.colors.text,
            borderRightWidth: 1,
            marginRight: 10,
          }}
        >
          {reviewList[user.role].map((r) => (
            <Text
              style={[
                commonStyle.text,
                {
                  textAlign: 'right',
                  marginRight: 10,
                  marginVertical: 4,
                  fontWeight: 'bold',
                },
              ]}
              key={r}
            >
              {r}
            </Text>
          ))}
        </View>
        <View style={{ flexDirection: 'column' }}>
          {ratings.map((r, idx) => (
            <AirbnbRating
              key={idx}
              isDisabled
              size={30}
              showRating={false}
              selectedColor={theme.colors.primary}
              defaultRating={r || 0}
            />
          ))}
        </View>
      </View>
      {user.presentation && user.presentation != '' && (
        <View style={{ marginLeft: 10 }}>
          <Headline style={{ fontStyle: 'italic', marginTop: 20 }}>
            A propos de {user.displayName}
          </Headline>
          <PaperText>{user.presentation}</PaperText>
        </View>
      )}
      {user.role == Role.Driver && (
        <View style={{alignItems: 'center'}}>
          <Divider
            style={{
              width:'100%',
              marginVertical: 10,
              borderColor: theme.colors.primary,
              borderWidth: 1,
            }}
          />
          {user.motoModel && user.motoModel != '' && (
            <View style={{ marginLeft: 10 }}>
              <Text style={commonStyle.text}>Modèle {user.motoModel}</Text>
              <MotoIcon/>
            </View>
          )}
          {user.immatriculation && (
            <Text style={commonStyle.text}>
              Immatriculation : {user.immatriculation}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}
