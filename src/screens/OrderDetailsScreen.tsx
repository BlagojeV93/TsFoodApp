import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import moment from 'moment';
import React, {useEffect, useState, createRef} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import {ButtonWithIcon, ButtonWithTitle, FoodCard} from '../componets';
import {AccountStackParamList, CartStackParamList} from '../model/navigation';
import {ApplicationState, UserState, OrderModel, onCancelOrder} from '../redux';

type OrderDetailsProps = CompositeScreenProps<
  NativeStackScreenProps<AccountStackParamList, 'OrderDetailScreen'>,
  NativeStackScreenProps<CartStackParamList, 'OrderDetailsScreen'>
>;

interface OrderDetailsScreenProps extends OrderDetailsProps {
  userReducer: UserState;
  onCancelOrder: Function;
}

const OrderDetailsScreen: React.FC<OrderDetailsScreenProps> = ({
  userReducer,
  navigation,
  route,
  onCancelOrder,
}) => {
  const {goBack} = navigation;
  const {order} = route.params;
  const {user} = userReducer;

  const onTapCancelOrder = () => {
    Alert.alert('Do you want to cancel this Order?', 'I mean really?', [
      {text: 'Cancel', onPress: () => {}, style: 'cancel'},
      {
        text: 'Yes',
        onPress: () => {
          onCancelOrder(order, user);
          goBack();
        },
      },
    ]);
  };

  const headerCard = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.orderInfo}>
          Order Date: {moment(order.orderDate).format('Do MMM YY, h:mm a')}
        </Text>
        <Text style={styles.orderInfo}>Order Amount: {order.totalAmount}</Text>
        <Text style={styles.orderInfo}>
          Paiid Through : {order.paidThrough}
        </Text>
        <Text style={styles.orderInfo}>Order Status: {order.orderStatus}</Text>
      </View>
    );
  };

  const footerCard = () => {
    if (order.orderStatus.toLowerCase() === 'cancelled') {
      return (
        <View style={styles.canceledOrderContainer}>
          <Text style={styles.orderText}>
            Order is Cancelled with ID: {order.orderID}
          </Text>
        </View>
      );
    } else {
      return (
        <>
          <View style={styles.otherOrderContainer}>
            <Text style={styles.orderText}>Map Vuiew</Text>
          </View>
          <View style={styles.cancelOrderButton}>
            <ButtonWithTitle
              title="Cancel Order"
              onTap={() => onTapCancelOrder()}
              height={50}
              width={320}
            />
          </View>
        </>
      );
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.navigation}>
        <View style={[styles.myCartContainer, {justifyContent: 'flex-start'}]}>
          <ButtonWithIcon
            icon={require('../images/back_arrow.png')}
            onTap={() => goBack()}
            width={32}
            height={38}
          />
          <Text style={{fontSize: 22, fontWeight: '600', marginLeft: 30}}>
            Order ID: {order.orderID}
          </Text>
        </View>
      </View>
      <View style={styles.body}>
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{width: '100%'}}
          data={order.items}
          renderItem={({item}) => (
            <FoodCard
              item={item.food}
              onTap={() => {}}
              onUpdateCart={() => {}}
              unit={item.unit}
            />
          )}
          keyExtractor={item => item._id}
          ListHeaderComponent={headerCard()}
          ListFooterComponent={footerCard()}
        />
      </View>
    </View>
  );
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
    flex: 11,
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
  header: {
    padding: 10,
    alignItems: 'flex-start',
  },
  orderInfo: {
    fontSize: 22,
    color: '#7C7C7C',
    fontWeight: '400',
    marginBottom: 10,
  },
  canceledOrderContainer: {
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  orderText: {
    fontSize: 18,
  },
  otherOrderContainer: {
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
    backgroundColor: '#C5C5C5',
  },
  cancelOrderButton: {
    marginBottom: 10,
  },
});

const mapStateToProps = (state: ApplicationState) => ({
  shoppingReducer: state.shoppingReducer,
  userReducer: state.userReducer,
});

export default connect(mapStateToProps, {onCancelOrder})(OrderDetailsScreen);
// rockglumac3@hotmail.com
// 0147258369+-+-
