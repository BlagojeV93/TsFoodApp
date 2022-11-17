import {useNavigation} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Text,
  FlatList,
} from 'react-native';
import {connect} from 'react-redux';
import {ButtonWithIcon, FoodCard} from '../componets';
import {HomeStackParamList, NavigationType} from '../model/navigation';
import {
  ApplicationState,
  FoodModel,
  Resturant,
  UserState,
  onUpdateCart,
} from '../redux';
import {checkExistence} from '../utils';
import {getImage} from '../utils/imageHelper';

type ResturantProps = NativeStackScreenProps<HomeStackParamList, 'ResturantScreen'>

interface ResturantScreenProps extends ResturantProps {
  userReducer: UserState;
  onUpdateCart: Function;
}

const ResturantScreen: React.FC<ResturantScreenProps> = ({ navigation, route, userReducer, onUpdateCart}) => {

  const {goBack, navigate} = navigation;
  const {item} = route?.params;
  const {cart} = userReducer;

  const onTapFood = (item: FoodModel) => {
    navigate('FoodDetails', {item});
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.navigation}>
        <ButtonWithIcon
          icon={require('../images/back_arrow.png')}
          onTap={() => goBack()}
          width={42}
          height={42}
        />
        <Text style={styles.resturantNavTitle}>{item.name}</Text>
      </View>
      <View style={styles.body}>
        <ImageBackground
          source={{uri: `${getImage(item.images[0])}`}}
          style={styles.imageBackground}>
          <View style={styles.resturantInfoContainer}>
            <Text style={styles.resturantPicTitle}>{item.name}</Text>
            <Text style={styles.resturantAddress}>
              {item.address}, {item.phone}
            </Text>
          </View>
        </ImageBackground>
        <FlatList
          style={{width: '100%'}}
          showsVerticalScrollIndicator={false}
          data={item.foods}
          renderItem={({item}) => (
            <FoodCard
              onTap={onTapFood}
              item={checkExistence(item, cart)}
              onUpdateCart={onUpdateCart}
            />
          )}
          keyExtractor={item => item._id}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  navigation: {
    flex: 1,
    marginTop: 43,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  resturantNavTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginLeft: 80,
  },
  body: {
    flex: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  imageBackground: {
    width: Dimensions.get('screen').width,
    height: 300,
    justifyContent: 'flex-end',
  },
  resturantInfoContainer: {
    height: 120,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
  },
  resturantPicTitle: {
    color: 'white',
    fontSize: 40,
    fontWeight: '700',
  },
  resturantAddress: {
    color: 'white',
    fontSize: 25,
    fontWeight: '500',
  },
});

const mapStateToProps = (state: ApplicationState) => ({
  userReducer: state.userReducer,
});

export default connect(mapStateToProps, {onUpdateCart})(ResturantScreen);
