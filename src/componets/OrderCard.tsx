import moment from 'moment';
import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';
import {OrderModel} from '../redux';

interface OrderCardProps {
  item: OrderModel;
  onTap: Function;
}

const OrderCard: React.FC<OrderCardProps> = ({item, onTap}) => {
  const orderStatus = () => {
    const status = item.orderStatus.toLowerCase();
    let statusIcon = require('../images/order_process.png');
    let statusMessage = status;
    if (status === 'completed') {
      statusMessage = 'Delivered';
      statusIcon = require('../images/orders.png');
    } else if (status === 'cancelled') {
      statusMessage = 'Cancelled';
      statusIcon = require('../images/warning-icon.png');
    }

    return (
      <View style={styles.orderStatusContainer}>
        <Image source={statusIcon} style={styles.orderStatusImage} />
        <Text style={styles.orderDateText}>{statusMessage.toUpperCase()}</Text>
      </View>
    );
  };

  return (
    <TouchableOpacity onPress={() => onTap()} style={styles.mainContainer}>
      <View style={styles.innerContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.orderIdText}>{item.orderID}</Text>
          <Text style={styles.orderDateText}>{moment(item.orderDate).format('Do MMM YY, h:mm a')}</Text>
          <Text style={styles.totalAmountText}>{item.totalAmount}</Text>
        </View>
        {orderStatus()}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: Dimensions.get('screen').width - 10,
    margin: 10,
    borderRadius: 20,
    height: 100,
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  textContainer: {
    flex: 8,
    padding: 5,
    marginTop: 5,
    paddingLeft: 20,
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  orderIdText: {
    fontSize: 22,
    fontWeight: '500',
  },
  orderDateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7C7C7C',
  },
  totalAmountText: {
    fontSize: 32,
    fontWeight: '500',
    color: '#FF5733',
  },
  orderStatusContainer: {
    flex: 3,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  orderStatusImage: {
    width: 60,
    height: 60,
  },
  orderStatusText: {
    fontSize: 12,
    color: '#7C7C7C',
  },
});

export {OrderCard};
