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
import { estimateDurationInMin, getDistanceInKm } from '../../utils/calculator';
import AddressHolder from './map/AddressHolder';

type Props = {
  toAddress: Address | undefined;
  fromAddress: Address | undefined;
  favoriteAddresses: Address[];
  user: User;
};

export default function CreateRace({
  toAddress,
  fromAddress,
  favoriteAddresses,
  user,
}: Props) {
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [price, setPrice] = useState(0);
  const kmPrice = 2500;

  useEffect(() => {
    if (!fromAddress || !toAddress) return;
    const distance: number = getDistanceInKm(fromAddress.pos, toAddress.pos);
    setDistance(distance);
    setDuration(estimateDurationInMin(distance));

    //Estimate Price
    if (distance > 2) setPrice(Math.round(distance * kmPrice));
    else setPrice(kmPrice);
  }, [fromAddress, toAddress]);

  const [currentRaceId, setCurrentRaceId] = useState(user.currentRaceId);

  const submit = () => {
    if (!fromAddress || !toAddress) return;
    setCurrentRaceId('');

    createRace(
      fromAddress,
      toAddress,
      distance,
      duration,
      price,
      (raceId: string) => {
        setCurrentRaceId(raceId);
        updateCurrentUser({
          currentRaceId: raceId,
          status: UserStatus.searching,
        });
      }
    );
  };

  const cancel = () => {
    deleteRace(currentRaceId!);
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
          justifyContent: 'space-between',
          paddingHorizontal: 12,
          paddingVertical: 15,
        }}
      >
        {!currentRaceId ? (
          <>
            <MyButton
              style={{ width: '30%', marginRight: 0 }}
              title="Valider"
              onPress={submit}
            />
            <View style={{ flexDirection: 'column' }}>
              <Text
                style={{
                  color: theme.colors.text,
                  fontStyle: 'italic',
                  textAlign: 'center',
                  fontSize: 16,
                }}
              >
                prix estimé
              </Text>
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
                style={{
                  color: theme.colors.text,
                  fontStyle: 'italic',
                  textAlign: 'center',
                  fontSize: 16,
                }}
              >
                {user.currency || 'GNF'}
              </Text>
            </View>
            <View style={{ flexDirection: 'column', marginTop: 10 }}>
              <Text style={[commonStyle.text, { fontStyle: 'italic' }]}>
                {distance.toFixed(1)} km
              </Text>
              <Text style={[commonStyle.text, { fontStyle: 'italic' }]}>
                {duration} min
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
