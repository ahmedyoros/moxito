import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { createRace } from '../../backend/RaceMaker';
import { deleteRace } from '../../backend/RaceManager';
import { updateCurrentUser } from '../../backend/UserManager';
import Loading from '../../components/Loading';
import MyButton from '../../components/MyButton';
import { deleteField } from '../../config';
import { UserStatus } from '../../enums/Status';
import CommonStyle from '../../styles/CommonStyle';
import { COLORS } from '../../themes/colors';
import useTheme from '../../themes/ThemeProvider';
import { Address } from '../../types/Address';
import { User } from '../../types/User';
import { estimateDurationInMin, getDistanceInKm } from '../../utils/calculator';
import MoxitoW from '../../assets/logos/moxito-w.svg';
import Moxito from '../../assets/logos/moxito.svg';
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
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (!fromAddress || !toAddress) {
      setShowDetails(false);
      return;
    }
    const distance: number = getDistanceInKm(fromAddress.pos, toAddress.pos);
    setDistance(distance);
    setDuration(estimateDurationInMin(distance));

    //Estimate Price
    if (distance > 2) setPrice(Math.round(distance * kmPrice));
    else setPrice(kmPrice);
    setShowDetails(true);
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
    <View style={{ paddingHorizontal: 15 }}>
      <View
        style={{
          paddingVertical: 9,
        }}
      >
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
        style={
          showDetails && {
            flexDirection: 'row',
            borderColor: theme.colors.text,
            borderTopWidth: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
          }
        }
      >
        {!currentRaceId ? (
          !showDetails ? (
            theme.dark ? (
              <MoxitoW
                style={{ alignSelf: 'center' }}
                width={350}
                height={120}
              />
            ) : (
              <Moxito
                style={{ alignSelf: 'center' }}
                width={350}
                height={120}
              />
            )
          ) : (
            <>
              <MyButton title="Valider" onPress={submit} />
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
                  {Math.round(price) + ' '}
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
          )
        ) : (
          <>
            <MyButton
              style={{ width: '30%', marginRight: 0 }}
              title="Annuler"
              onPress={cancel}
            />
            <View>
              <Loading size={32} />
              <Text
                style={[
                  commonStyle.text,
                  { fontSize: 18, color: COLORS.darkOrange },
                ]}
              >
                Recherche en cours...
              </Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
}
