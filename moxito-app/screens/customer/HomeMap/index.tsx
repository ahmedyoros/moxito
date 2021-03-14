import React, { useState, useEffect } from "react";
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import * as Location from 'expo-location';


const HomeMap = () => {

  const [lat, SetLat] = useState(0);
  const [lng, SetLong] = useState(0);

  
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log("+++ no");
        return;
      }

      console.log("+++ yes");

      let location = await Location.getCurrentPositionAsync({});
      SetLat(location.coords.latitude);
      SetLong(location.coords.longitude);
      console.log(JSON.stringify(location));
    })();
  }, []);

  return (
    <MapView
      style={{width: '100%', height: '100%'}}
      provider={PROVIDER_GOOGLE}
      showsUserLocation={true}
      initialRegion={{
        latitude: lat === 0 ? 28.450627 : lat,
        longitude: lng === 0 ? -16.263045 : lng,
        latitudeDelta: 0.0222,
        longitudeDelta: 0.0121,
      }}>
    
    </MapView>
  );
};

export default HomeMap;
