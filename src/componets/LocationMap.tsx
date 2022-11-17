import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import MapView from 'react-native-maps';

interface Region {
  longitude: number;
  latitude: number;
  longitudeDelta: number;
  latitudeDelta: number;
}

interface LocationMapProps {
  onMarkerChanged: (location: Region) => void;
  lastLocation: Region;
}

const LocationMap: React.FC<LocationMapProps> = ({
  onMarkerChanged,
  lastLocation,
}) => {
  return (
    <View style={styles.mainContainer}>
      <MapView
        style={{flex: 1}}
        initialRegion={lastLocation}
        onRegionChangeComplete={onMarkerChanged}
      />
      <View style={styles.marker}>
        <Image style={styles.markerImage} source={require('../images/delivery_icon.png')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: '100%',
  },
  marker: {
    left: '50%',
    top: '50%',
    position: 'absolute',
    marginLeft: -24,
    marginTop: -48
  },
  markerImage: {
    width: 50,
    height: 50
  }
});

export {LocationMap};
