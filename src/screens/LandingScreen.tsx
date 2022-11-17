import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions, Image, Text, Alert} from 'react-native';
import * as Location from 'expo-location';
import {connect, useDispatch, useSelector} from 'react-redux';
import {ThunkDispatch} from 'redux-thunk';
import {AnyAction} from 'redux';
import {ApplicationState, UserState, onUpdateLocation} from '../redux';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
  useNavigation,
} from '@react-navigation/native';
import {
  NavigationType,
  RootStackParamList,
  TabsParamList,
} from '../model/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

const screenWidth = Dimensions.get('screen').width;

type LandingProps = NativeStackScreenProps<RootStackParamList, 'Landing'>;

type AppDispatch = ThunkDispatch<UserState, any, AnyAction>;

const LandingScreen: React.FC<LandingProps> = ({navigation}) => {
  const {navigate} = navigation;
  // const {onUpdateLocation, userReducer } = props;
  const userReducer = useSelector(
    (state: ApplicationState) => state.userReducer,
  );
  const dispatch: AppDispatch = useDispatch();
  const [errorMsg, setErrorMsg] = useState('');
  const [address, setAddress] = useState<Location.LocationGeocodedLocation>();
  const [displayAddress, setDisplayAddress] = useState(
    'Waiting for Current Location',
  );

  const showAlert = (title: string, msg: string) => {
    Alert.alert(title, msg, [
      {
        text: 'OK',
        onPress: () => navigate('LocationScreen'),
      },
    ]);
  };

  const checkExistingLocation = async () => {
    try {
      const locationData = await AsyncStorage.getItem('user_location');
      if (locationData) {
        const saveAddress = JSON.parse(locationData);
        dispatch(onUpdateLocation(saveAddress));
        setTimeout(() => {
          navigate('Tabs', {screen: 'Home'});
        }, 500);
      } else {
        fetchUserAddress();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkExistingLocation();
  }, []);

  const fetchUserAddress = async () => {
    try {
      const {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        showAlert(
          'Location Permission Needed!',
          'Location permission needed to access your nearest resturants.',
        );
        return;
      }

      const {coords}: any = await Location.getCurrentPositionAsync();

      if (coords) {
        const {latitude, longitude} = coords;
        const addressResponse: any = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        for (let item of addressResponse) {
          setAddress(item);
          const currentAddress = `${item.name}, ${item.street}, ${item.postalCode}, ${item.country}`;
          const {country, city, postalCode} = item;
          //onUpdateLocation(item);
          dispatch(
            onUpdateLocation({
              displayAddress: currentAddress,
              postalCode,
              city,
              country,
            }),
          );
          setDisplayAddress(currentAddress);
          break;
        }
        if (addressResponse.length) {
          setTimeout(() => {
            navigate('Tabs', {screen: 'Home'});
          }, 2500);
        }
        return;
      } else {
        showAlert(
          'Location Not Found!',
          'Please enter your location to access your nearest resturants.',
        );
      }
    } catch (error) {
      showAlert(
        'Location Permission Needed!',
        'Location permission needed to access your nearest resturants.',
      );
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.navigation} />

      <View style={styles.body}>
        <Image
          source={require('../images/delivery_icon.png')}
          style={styles.deliveryIcon}
        />
        <View style={styles.addressContainer}>
          <Text style={styles.addressTitle}>Your Delivery Address</Text>
        </View>

        <Text style={styles.addressText}>{displayAddress}</Text>
      </View>

      <View style={styles.footer} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#rgba(242,242,242,1)',
  },
  navigation: {
    flex: 2,
  },
  body: {
    flex: 9,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 22,
    fontWeight: '700',
  },
  addressText: {
    fontSize: 20,
    fontWeight: '200',
    color: '#4F4F4F',
    textAlign: 'center',
  },
  footer: {
    flex: 1,
  },
});

export default LandingScreen;

// const mapStateToProps = (state: ApplicationState) => ({
//   userReducer: state.userReducer,
// });

// export default connect(mapStateToProps, {onUpdateLocation})(LandingScreen);
