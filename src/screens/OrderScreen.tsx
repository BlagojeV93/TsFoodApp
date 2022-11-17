import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, {useEffect, useState, createRef} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import {ButtonWithIcon, OrderCard} from '../componets';
import { CartStackParamList } from '../model/navigation';
import {
  ApplicationState,
  ShoppingState,
  UserState,
  onGetOrders,
  OrderModel,
} from '../redux';

interface OrderScreenProps {
  shoppingReducer: ShoppingState;
  onGetOrders: Function;
  userReducer: UserState;
  navigation: {goBack: Function};
}

const OrderScreen: React.FC<OrderScreenProps> = ({
  userReducer,
  navigation,
  onGetOrders,
}) => {
  const { navigate } = useNavigation<NavigationProp<CartStackParamList>>()
  const {user, orders} = userReducer;

  useEffect(() => {
    onGetOrders(user);
  }, []);

  const ontapOrder = (order: OrderModel) => {
    navigate('OrderDetailsScreen', { order })
  }

  if (orders.length) {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.navigation}>
          <View
            style={[styles.myCartContainer, {justifyContent: 'flex-start'}]}>
            <ButtonWithIcon
              icon={require('../images/back_arrow.png')}
              onTap={() => navigation.goBack()}
              width={32}
              height={38}
            />
            <Text style={{fontSize: 22, fontWeight: '600', marginLeft: 30}}>
              My Orders
            </Text>
          </View>
        </View>
        <View style={styles.body}>
          <FlatList
            showsVerticalScrollIndicator={false}
            style={{width: '100%'}}
            data={orders}
            renderItem={({item}) => <OrderCard item={item} onTap={() => ontapOrder(item)} />}
            keyExtractor={item => item._id}
          />
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.navigation}>
          <View style={styles.navigation}>
            <View
              style={[styles.myCartContainer, {justifyContent: 'flex-start'}]}>
              <ButtonWithIcon
                icon={require('../images/back_arrow.png')}
                onTap={() => navigation.goBack()}
                width={32}
                height={38}
              />
              <Text style={{fontSize: 22, fontWeight: '600', marginLeft: 30}}>
                My Orders
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.body}>
          <Text style={styles.emptyCartText}>Your have no Orders!!</Text>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  navigation: {
    flex: 1,
    marginTop: 43,
  },
  innerNavigation: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  body: {
    flex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flex: 2,
    padding: 10,
  },
  amountView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  amountText: {
    fontSize: 18,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 25,
    fontWeight: '700',
  },
  popUpContainer: {
    justifyContent: 'space-around',
    width: '100%',
  },
  payableAmountTitle: {
    fontSize: 20,
  },
  payableAmountText: {
    fontSize: 20,
    fontWeight: '600',
  },
  paymentView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    margin: 5,
    backgroundColor: '#E3BE74',
  },
  addressContainer: {
    height: 100,
    padding: 20,
    flexDirection: 'row',
  },
  addressImage: {
    width: 50,
    height: 50,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  addressInfoText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 5,
    width: Dimensions.get('screen').width - 60,
  },
  optionsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 20,
  },
  options: {
    height: 120,
    width: 160,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderColor: '#A0A0A0',
    backgroundColor: '#F2F2F2',
    borderWidth: 0.2,
    borderRadius: 10,
    margin: 10,
  },
  optionIcon: {
    width: 115,
    height: 80,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#545252',
  },
  myCartContainer: {
    height: 60,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
    paddingHorizontal: 20,
  },
});

const mapStateToProps = (state: ApplicationState) => ({
  shoppingReducer: state.shoppingReducer,
  userReducer: state.userReducer,
});

export default connect(mapStateToProps, {onGetOrders})(OrderScreen);
// rockglumac3@hotmail.com
// 0147258369+-+-
