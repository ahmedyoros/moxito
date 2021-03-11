import React from 'react';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { getSampleAddresses } from '../../backend/AddressProvider';
import { createRace } from '../../backend/RaceMaker';
import { getBaseUser, updateCurrentUser } from '../../backend/UserManager';
import { BarTitle } from '../../components/BarTitle';
import MyButton from '../../components/MyButton';
import { RaceStatus, UserStatus } from '../../enums/Status';
import { UserProps } from '../../types/Props';
import { Race } from '../../types/Race';

export default function SearchMap({ user }: UserProps) {
  const search = () => {
    const addresses = getSampleAddresses();
    
    const race: Race = {
      createdAt: Date.now(),
      from: addresses[0],
      to: addresses[1],
      customer: getBaseUser(),
      raceDistance: 100,
      estimateDuration: 100,
      price: 100,
      status: RaceStatus.pending,
    };
    createRace(race, (raceId: string) =>
      updateCurrentUser({ status: UserStatus.searching, currentRaceId: raceId })
    );
  };

  return (
    <View>
      <BarTitle title={`Où allez vous ${user.firstname} ?`} />
      <TextInput placeholder="Destination" />
      <MyButton title="Rechercher" onPress={search} />
    </View>
  );
}
