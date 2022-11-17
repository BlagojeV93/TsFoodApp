import React from 'react';
import {View, StyleSheet} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import { GOOGLE_MAP_KEY } from '../utils';

interface LocationPickProps {
  onChangeLocation: Function;
}

const LocationPick: React.FC<LocationPickProps> = ({onChangeLocation}) => {
  return (
    <View style={styles.mainContainer}>
      <GooglePlacesAutocomplete
        minLength={4}
        placeholder="Search Your Address"
        fetchDetails
        onPress={(_, details = null) => {
          if (details?.geometry) {
            onChangeLocation(details.geometry.location) 
          }
          console.log(JSON.stringify(details?.geometry.location))
        }}
        query={{
          key: GOOGLE_MAP_KEY,
          language: 'en'
        }}
        debounce={300}
        onFail={(err) => console.log(err)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: '100%'
  },
});

export {LocationPick};
