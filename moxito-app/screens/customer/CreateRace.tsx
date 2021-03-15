import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { createRace } from '../../backend/RaceMaker';
import { deleteRace } from '../../backend/RaceManager';
import { getBaseUser, updateCurrentUser } from '../../backend/UserManager';
import Loading from '../../components/Loading';
import MyButton from '../../components/MyButton';
import { deleteField } from '../../config';
import { RaceStatus, UserStatus } from '../../enums/Status';
import CommonStyle from '../../styles/CommonStyle';
import useTheme from '../../themes/ThemeProvider';
import { Address } from '../../types/Address';
import { MyRouteProp } from '../../types/Props';
import { Race } from '../../types/Race';
import { User } from '../../types/User';
import AddressHolder from './map/AddressHolder';

const geofire = require('geofire-common');

type Props = {
  toAddress: Address | undefined;
  fromAddress: Address | undefined;
  favoriteAddresses: Address[];
};

export default function CreateRace({
  toAddress,
  fromAddress,
  favoriteAddresses,
}: Props) {
  const route: MyRouteProp = useRoute();
  const user = route.params?.user;

  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [price, setPrice] = useState(0);
  const kmPrice = 2500;

  useEffect(() => {
    if (!fromAddress || !toAddress) return;
    const distance: number = geofire.distanceBetween(
      [fromAddress.pos.latitude, fromAddress.pos.longitude],
      [toAddress.pos.latitude, toAddress.pos.longitude]
    );
    setDistance(distance);
    const estimatedSpeed = 25; // km/h
    setDuration((distance / estimatedSpeed) * 3600);

    //Price
    if (distance > 2)
      setPrice(distance*kmPrice);
    else setPrice(kmPrice)
  }, [fromAddress, toAddress]);

  const [currentRaceId, setCurrentRaceId] = useState(user.currentRaceId)

  const submit = () => {
    if (!fromAddress || !toAddress) return;
    const race: Race = {
      createdAt: Date.now(),
      from: fromAddress,
      to: toAddress,
      customer: getBaseUser(),
      raceDistance: distance,
      estimateDuration: duration,
      price: price,
      status: RaceStatus.pending,
    };

    setCurrentRaceId(0);
    createRace(race, (raceId: string) => {
      setCurrentRaceId(raceId);
      updateCurrentUser({
        currentRaceId: raceId,
        status: UserStatus.searching,
      });
    });
  };

  const cancel = () => {
    deleteRace(currentRaceId);
    updateCurrentUser({
      status: UserStatus.idle,
      currentRaceId: deleteField(),
    });
    setCurrentRaceId(undefined);
  };

  const theme = useTheme();
  const commonStyle = CommonStyle(theme);

  return (
    <View>
      <View>
        <AddressHolder
          suggestCurrentLocation={true}
          address={fromAddress}
          title="Départ"
          index="from"
          favoriteAddresses={favoriteAddresses}
          searching={user.status === UserStatus.searching}
        />
        <AddressHolder
          suggestCurrentLocation={false}
          address={toAddress}
          title="Destination"
          index="to"
          favoriteAddresses={favoriteAddresses}
          searching={user.status === UserStatus.searching}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          borderColor: theme.colors.text,
          borderTopWidth: 1,
          justifyContent:'space-between',
          paddingHorizontal: 12,
          paddingVertical: 15
        }}
      >
        {!(currentRaceId) ? (
          <>
            <MyButton
              style={{ width: '30%', marginRight: 0 }}
              title="Valider"
              onPress={submit}
            />
            <View style={{ flexDirection: 'column'}}>
              <Text
                style={{
                  fontStyle: 'italic',
                  fontSize: 36,
                  color: theme.colors.primary,
                }}
              >
                {Math.round(price)}
              </Text>
              <Text
                style={[
                  commonStyle.text,
                  { fontStyle: 'italic', textAlign: 'center', fontSize: 16},
                ]}
              >
                GNF
              </Text>
            </View>
            <View style={{ flexDirection: 'column', marginTop: 10 }}>
              <Text style={[commonStyle.text, { fontStyle: 'italic' }]}>
                {distance.toFixed(1)} km
              </Text>
              <Text style={[commonStyle.text, { fontStyle: 'italic' }]}>
                {Math.round(duration/ 60)} min
              </Text>
            </View>
          </>
        ) : (
          <>
            <MyButton
              style={{ width: '30%', marginRight: 0 }}
              title="Annuler"
              onPress={cancel}
            />
            <View style={{ alignContent: 'center', left: 20 }}>
              <Loading size={50} />
              <Text style={[commonStyle.text]}>Recherche en cours...</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
}
