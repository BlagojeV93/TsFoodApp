import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions, Image, Text, Alert} from 'react-native';
import {ThunkDispatch} from 'redux-thunk';
import {AnyAction} from 'redux';
import {
  ApplicationState,
  UserState,
  onFetchLocation,
  Address,
  onUpdateLocation,
} from '../redux';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {HomeStackParamList, NavigationType, RootStackParamList} from '../model/navigation';
import {
  ButtonWithIcon,
  ButtonWithTitle,
  LocationMap,
  LocationPick,
} from '../componets';
import {Point} from 'react-native-google-places-autocomplete';
import {connect} from 'react-redux';

const screenWidth = Dimensions.get('screen').width;

interface LocationProps {
  onFetchLocation: Function;
  onUpdateLocation: Function;
  userReducer: UserState;
}

interface Region {
  longitude: number;
  latitude: number;
  longitudeDelta: number;
  latitudeDelta: number;
}

type AppDispatch = ThunkDispatch<UserState, any, AnyAction>;

const LocationScreen: React.FC<LocationProps> = ({
  userReducer,
  onFetchLocation,
  onUpdateLocation,
}) => {
  const {navigate} = useNavigation<NavigationProp<HomeStackParamList>>();
  const [isMap, setIsmap] = useState(false);
  const [region, setRegion] = useState<Region>({
    latitude: 26.9,
    longitude: 93.701,
    longitudeDelta: 0.0421,
    latitudeDelta: 0.0922,
  });
  const [currentAddress, setCurrentAddress] = useState(
    'Pick a Location from Map',
  );
  const [selectedAddress, setSelectedAddress] = useState<Address>();
  const {pickedAddress} = userReducer;

  useEffect(() => {
    if (pickedAddress.place_id) {
      const {address_components} = pickedAddress;
      if (address_components.length) {
        setCurrentAddress(pickedAddress.formatted_address);

        address_components.map(item => {
          let city = '';
          let country = '';
          let postalCode = '';

          if (item.types.filter(el => el === 'postal_code').length > 0) {
            postalCode = item.short_name;
          }
          if (item.types.filter(el => el === 'country').length > 0) {
            country = item.short_name;
          }
          if (item.types.filter(el => el === 'locality').length > 0) {
            city = item.short_name;
          }

          setSelectedAddress({
            displayAddress: pickedAddress.formatted_address,
            city,
            country,
            postalCode,
          });
        });
      }
    }
  }, [pickedAddress]);

  const onTapConfirmLocation = () => {
    if (selectedAddress?.postalCode) {
      onUpdateLocation(selectedAddress);
      navigate('HomeScreen');
    }
  };

  const onChangeLocation = (location: Point) => {
    setRegion(prev => ({
      ...prev,
      latitude: location.lat,
      longitude: location.lng,
    }));
    setIsmap(true);
  };

  const onChangeRegion = (newRegion: Region) => {
    setRegion(newRegion);
    onFetchLocation(newRegion.latitude, newRegion.longitude);
  };

  const mapView = () => {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.navigation}>
          <View style={styles.innerNavigation}>
            <ButtonWithIcon
              icon={require('../images/back_arrow.png')}
              onTap={() => setIsmap(false)}
              width={40}
              height={50}
            />
            <View style={{flex: 1, marginLeft: 20}}>
              <Text style={styles.pickLocationFromMaText}>
                Pick Your Location
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.body}>
          <LocationMap onMarkerChanged={onChangeRegion} lastLocation={region} />
        </View>
        <View style={styles.footer}>
          <View style={styles.confirmAddressContainer}>
            <Text style={styles.selectAddressText}>{currentAddress}</Text>
            <ButtonWithTitle
              title="Confirm"
              width={320}
              height={50}
              onTap={onTapConfirmLocation}
            />
          </View>
        </View>
      </View>
    );
  };

  const pickLocation = () => {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.pickLocationInnerContainer}>
          <ButtonWithIcon
            icon={require('../images/back_arrow.png')}
            onTap={() => navigate('HomeScreen')}
            width={40}
            height={50}
          />
          <View style={styles.inputLocationContainer}>
            <LocationPick onChangeLocation={onChangeLocation} />
          </View>
        </View>

        <View style={styles.centerMsg}>
          <Image
            source={require('../images/delivery_icon.png')}
            style={styles.deliveryIcon}
          />

          <Text style={styles.addressTitle}>Pick Your Location</Text>
        </View>
      </View>
    );
  };

  return isMap ? mapView() : pickLocation();
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#rgba(242,242,242,1)',
  },
  navigation: {
    flex: 1.5,
  },
  innerNavigation: {
    height: 60,
    width: '100%',
    marginTop: 43,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    paddingLeft: 10,
  },
  body: {
    flex: 7.5,
  },
  deliveryIcon: {
    width: 120,
    height: 120,
  },
  addressContainer: {
    width: screenWidth - 100,
    borderBottomColor: 'red',
    borderBottomWidth: 0.5,
    padding: 5,
    marginBottom: 30,
    alignItems: 'center',
  },
  addressTitle: {
    fontSize: 20,
    fontWeight: '200',
    color: '#7D7D7D',
    marginLeft: -10,
  },
  addressText: {
    fontSize: 20,
    fontWeight: '200',
    color: '#4F4F4F',
    textAlign: 'center',
  },
  footer: {
    flex: 2,
  },
  pickLocationInnerContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginTop: 44,
    marginLeft: 5,
  },
  inputLocationContainer: {
    marginRight: 5,
    width: '100%',
  },
  centerMsg: {
    left: '50%',
    top: '50%',
    position: 'absolute',
    marginLeft: -70,
    marginTop: -50,
  },
  pickLocationFromMaText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#656565',
  },
  confirmAddressContainer: {
    backgroundColor: 'white',
    padding: 10,
    paddingHorizontal: 20,
  },
  selectAddressText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#545454',
  },
});

const mapStateToProps = (state: ApplicationState) => ({
  userReducer: state.userReducer,
});

export default connect(mapStateToProps, {onFetchLocation, onUpdateLocation})(
  LocationScreen,
);
