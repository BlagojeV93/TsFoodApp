import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Text,
} from 'react-native';
import {connect} from 'react-redux';
import {ButtonWithIcon, FoodCard} from '../componets';
import {HomeStackParamList} from '../model/navigation';
import {ApplicationState, onUpdateCart, UserState} from '../redux';
import {checkExistence} from '../utils';
import {getImage} from '../utils/imageHelper';

type FoodDetailsProps = NativeStackScreenProps<HomeStackParamList, 'FoodDetails'>;

interface FoodDetailScreenProps extends FoodDetailsProps {
  userReducer: UserState;
  onUpdateCart: Function;
}

const FoodDetailScreen: React.FC<FoodDetailScreenProps> = props => {
  const {goBack} = props.navigation;
  const {item} = props.route.params;
  const {userReducer, onUpdateCart} = props;
  const {cart} = userReducer;

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
            <Text style={styles.resturantAddress}>{item.category}</Text>
          </View>
        </ImageBackground>
        <View style={styles.foodInfoContainer}>
          <Text>Food will be rady in {item.readyTime} Minute(s)</Text>
          <Text>{item.description}</Text>
        </View>
        <View style={styles.foodCardContainer}>
          <FoodCard
            item={checkExistence(item, cart)}
            onTap={() => {}}
            onUpdateCart={onUpdateCart}
          />
        </View>
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
    marginLeft: 60,
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
    fontSize: 30,
    fontWeight: '700',
  },
  resturantAddress: {
    color: 'white',
    fontSize: 25,
    fontWeight: '500',
  },
  foodInfoContainer: {
    padding: 20,
  },
  foodCardContainer: {
    height: 120,
  },
});

const mapStateToProps = (state: ApplicationState) => ({
  userReducer: state.userReducer,
});

export default connect(mapStateToProps, {onUpdateCart})(FoodDetailScreen);
