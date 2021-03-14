import React , {useState, useEffect} from 'react';
import { View, Dimensions} from 'react-native';
import { createRace } from '../../backend/RaceMaker';
import { getBaseUser, updateCurrentUser } from '../../backend/UserManager';
import MyButton from '../../components/MyButton';
import { RaceStatus, UserStatus } from '../../enums/Status';
import { UserProps } from '../../types/Props';
import { Race } from '../../types/Race';
import HomeMap from './HomeMap';
import styles from './styles';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import PlaceRow from './PlaceRow';
import { LocationLatLng } from '../../types/LocationLatLng';



export default function SearchMap({ user }: UserProps) {
  const height = Dimensions.get('window').height;
  const height1 = height*0.2;
  const height2 = height*0.3;
  const defaultPosition : LocationLatLng = {
    lat :  0,
    lng: 0,
    city: "",
    street: ""
  }
  
  const [originPlace, setOriginPlace] = useState(null);
  const [race, setRace] = useState(null);

  const [destinationPlace, setDestinationPlace] = useState(null);
  const [validateState, setValidate] = useState(null);
  
  const [position, setPosition] = useState(defaultPosition);
  const [destination, setDestination] = useState(defaultPosition);






  const [selectedHeight, setHeight] = useState(height1);

  const search = () => {

    const race: Race = {
      createdAt: Date.now(),
      from: {
        street: position.street,
        city: position.city,
        pos: { lat: position.lat, lng: position.lng },
      },
      to: {
        street: destination.street,
        city: destination.city,
        pos: { lat: destination.lat, lng: destination.lng },
      },
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

  const isCompleted = () => {
    return originPlace && destinationPlace;
  }

  useEffect(() => {
    if (isCompleted()) {
      setHeight(height2);

    } else {
        setHeight(height1);
    }
  });

  return (
    <View>
      <View style={{height: selectedHeight}}>
        <HomeMap />
      </View>

      <View style={styles.container}>
  
          <GooglePlacesAutocomplete
            placeholder="Votre position"
            onPress={(data, details = null) => {
              setOriginPlace({data, details});

              if (details?.geometry.location.lat && details?.geometry.location.lng){
                let position : LocationLatLng = {
                  lat : details?.geometry.location.lat,
                  lng: details?.geometry.location.lng,
                  street: details?.name,
                  city: details?.vicinity
                }
                setPosition(position)
              }
       
            }}
            
            enablePoweredByContainer={false}
            suppressDefaultStyles
            currentLocation={true}
            currentLocationLabel='Ma position'
            styles={{
              textInput: styles.textInput,
              container: styles.autocompleteContainer,
              listView: styles.listView,
              separator: styles.separator,
            }}
            query={{
              key: 'AIzaSyABXgnEA7O5REXo5wCGq2UuGWpbHrTn8Cg',
              language: 'en',
            }}
            fetchDetails
            renderRow={(data) => <PlaceRow data={data} />}
            renderDescription={(data) => data.description || data.vicinity}
          />
  
  
          <GooglePlacesAutocomplete
            placeholder="Votre destination"
            onPress={(data, details = null) => {
              setDestinationPlace({data, details});
          
              if (details?.geometry.location.lat && details?.geometry.location.lng){
                let destionation : LocationLatLng = {
                  lat : details?.geometry.location.lat,
                  lng: details?.geometry.location.lng,
                  street: details?.name,
                  city: details?.vicinity
                }
                setDestination(destionation)
              }
   
            }}
            enablePoweredByContainer={false}
            suppressDefaultStyles
            styles={{
              textInput: styles.textInput,
              container: {
                ...styles.autocompleteContainer,
                top: 55,
              },
              separator: styles.separator,
            }}
            fetchDetails
            query={{
              key: 'AIzaSyABXgnEA7O5REXo5wCGq2UuGWpbHrTn8Cg',
              language: 'en',
            }}
            renderRow={(data) => <PlaceRow data={data} />}
          />
      
  
        {/* Circle near Origin input */}
        <View style={styles.circle} />
  
        {/* Line between dots */}
        <View style={styles.line} />
  
        {/* Square near Destination input */}
        <View style={styles.square} />
    
  
      </View>
      <View style={{
        position: 'absolute',
        top: height*0.8,
        left: 10,
        }}
      >
        <MyButton  title="Valider" onPress={isCompleted() ? search : null } />
      </View>
    </View>
  );
}
