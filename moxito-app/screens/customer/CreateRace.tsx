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
import { COLORS } from '../../themes/colors';
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
  const [showPrice, setShowPrice] = useState(false);
  const [showDetails, setShowDetails] = useState(false);



  useEffect(() => {
    if (!fromAddress || !toAddress) {
      setShowPrice(false);
      setShowDetails(false);
      return;
    }
    const distance: number = getDistanceInKm(fromAddress.pos, toAddress.pos);
    setDistance(distance);
    setDuration(estimateDurationInMin(distance));
    setShowDetails(true);

    //Estimate Price
    if (distance > 2)
      setPrice(Math.round(distance*kmPrice));
    else setPrice(kmPrice)
    setShowPrice(true);
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
    <View style={{paddingHorizontal: 15}}>
      <View 
        style={{
          paddingBottom: 10,
          paddingTop: 9
        }}>
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
          alignItems: 'center',
        }}
      >
        {!currentRaceId ? (
          <>
            <MyButton
              title="Valider"
              onPress={submit}
            />
            { showPrice ? (<View style={{ flexDirection: 'column' }}>
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
                {Math.round(price) + " "}
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
            </View>) : null}

            {showDetails? (<View style={{ flexDirection: 'column', marginTop: 10 }}>
              <Text style={[commonStyle.text, { fontStyle: 'italic' }]}>
                {distance.toFixed(1)} km
              </Text>
              <Text style={[commonStyle.text, { fontStyle: 'italic' }]}>
                {duration} min
              </Text>
            </View>) : null}
            
          </>
        ) : (
          <>
            <MyButton
              style={{ width: '30%', marginRight: 0 }}
              title="Annuler"
              onPress={cancel}
            />
            <View>
              <Loading size={32} />
              <Text style={[commonStyle.text, { fontSize: 18, color: COLORS.darkOrange}]}>Recherche en cours...</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
}
