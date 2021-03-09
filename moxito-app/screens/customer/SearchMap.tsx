import React from 'react';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { getSampleAddresses } from '../../backend/AddressProvider';
import { createRace } from '../../backend/RaceManager';
import { updateCurrentUser } from '../../backend/UserManager';
import { BarTitle } from '../../components/BarTitle';
import MyButton from '../../components/MyButton';
import { UserStatus } from '../../enums/Status';
import { UserProps } from '../../types/Props';

export default function SearchMap({ user }: UserProps) {
  const search = () => {
    const addresses = getSampleAddresses();
    createRace(addresses[0], addresses[1], (raceId) =>
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
