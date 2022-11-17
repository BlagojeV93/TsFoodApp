import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState, createRef} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import {
  ButtonWithIcon,
  ButtonWithTitle,
  FoodCard,
  FoodCardInfo,
  SearchBar,
} from '../componets';
import {CartStackParamList, NavigationType} from '../model/navigation';
import {
  ApplicationState,
  ShoppingState,
  UserState,
  onUpdateCart,
  onCreateOrder,
  FoodModel,
  UserModel,
  onApplyRemoveOffer,
  OfferModel,
} from '../redux';
import {checkExistence} from '../utils';
import RBSheet from 'react-native-raw-bottom-sheet';
import {CardPayment} from '../componets/CardPayment';
import {
  PaymentIntent
} from '@stripe/stripe-react-native';

interface CartScreenProps {
  shoppingReducer: ShoppingState;
  userReducer: UserState;
  onUpdateCart: Function;
  onCreateOrder: (cart: FoodModel[], user: UserModel, response: string) => void;
  onApplyRemoveOffer: (offer: OfferModel, remove: boolean) => void;
}

const CartScreen: React.FC<CartScreenProps> = ({
  userReducer,
  onUpdateCart,
  onCreateOrder,
  shoppingReducer,
  onApplyRemoveOffer,
}) => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [payableAmmount, setPayableAmmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [isPayment, setIsPayment] = useState(false);
  const {cart, user, location, orders} = userReducer;
  const {appliedOffer} = shoppingReducer;
  const {navigate} = useNavigation<NavigationType<CartStackParamList>>();
  const popupRef = createRef<RBSheet>();

  useEffect(() => {
    calculateAmount();
  }, [cart]);

  const showAlert = (title: string, msg: string) => {
    Alert.alert(title, msg, [
      {
        text: 'OK',
        onPress: () => {
          onApplyRemoveOffer(appliedOffer, true);
        },
      },
    ]);
  };

  const calculateAmount = () => {
    let total = 0;
    cart.map(food => {
      total += food.price * food.unit;
    });
    const tax = (total / 100) * 0.9 + 40;

    if (total > 0) {
      setTotalTax(tax);
    }

    setTotalAmount(total);
    setPayableAmmount(total + tax);
    setDiscount(0);

    if (appliedOffer._id) {
      if (total >= appliedOffer.minValue) {
        const discount = (total / 100) * appliedOffer.offerPercentage;
        setDiscount(discount);
        const afterDiscount = total - discount;
        setPayableAmmount(afterDiscount);
      } else {
        showAlert(
          'The Applied Offer is not Applicable!',
          `This offer is applicable with minimum ${appliedOffer.minValue} only! Please select another offer`,
        );
      }
    }
  };

  const onValidateOrder = () => {
    if (!user.verified) {
      navigate('LoginScreen');
    } else {
      popupRef.current?.open();
    }
  };

  const onPlaceOrder = (paymentResponse: string) => {
    onCreateOrder(cart, user, paymentResponse);
    popupRef.current?.close();
    onApplyRemoveOffer(appliedOffer, true);
  };

  const onPaymentSuccess = (paymentResponse: PaymentIntent.Result) => {
    if (paymentResponse.status === 'Succeeded') {
      const responseString = JSON.stringify(paymentResponse);
      onPlaceOrder(responseString);
      console.log(responseString);
    }
  };

  const onPaymentFailed = (failedResponse: string) => {
    setIsPayment(false);
    showAlert('Payment Cancelled!', 'Payment failed! ' + failedResponse);
  };

  const onPaymentCancel = () => {
    setIsPayment(false);
    showAlert(
      'Payment Cancelled!',
      'Payment failed! User cancelled the payment',
    );
  };

  const footerContent = () => {
    return (
      <View style={styles.footerContent}>
        <TouchableOpacity
          onPress={() => navigate('OffersScreen')}
          style={styles.row}>
          <View style={{flex: 1}}>
            <Text style={styles.offersText}>Offers & Deals</Text>
            {appliedOffer._id ? (
              <View style={{flex: 1}}>
                <Text style={styles.appliedMessage}>
                  Applied {appliedOffer.offerPercentage} % of Discount
                </Text>
              </View>
            ) : (
              <View>
                <Text style={styles.canApplyMessage}>
                  You can apply available Offers. *Tnc Apply.
                </Text>
              </View>
            )}
          </View>
          <Image
            source={require('../images/arrow_icon.png')}
            style={{width: 30, height: 30}}
          />
        </TouchableOpacity>
        <View style={[styles.row, styles.billingMainContainer]}>
          <Text style={[styles.optionText, {fontSize: 18, marginBottom: 10}]}>
            Billing Details
          </Text>
          <View style={styles.paymentInfo}>
            <Text style={{flex: 1, fontSize: 14}}>Total</Text>
            <Text style={{fontSize: 16}}> ₹{totalAmount.toFixed(0)}</Text>
          </View>
          <View style={styles.paymentInfo}>
            <Text style={{flex: 1, fontSize: 14}}>Tax & Delivery Change</Text>
            <Text style={{fontSize: 16}}> ₹{totalTax.toFixed(0)}</Text>
          </View>
          {appliedOffer._id && (
            <View style={styles.paymentInfo}>
              <Text style={{flex: 1, fontSize: 14}}>
                {' '}
                Discount (applied {appliedOffer.offerPercentage.toFixed(0)} %
                Offer)
              </Text>
              <Text style={{fontSize: 16}}> ₹{discount.toFixed(0)}</Text>
            </View>
          )}
          <View style={styles.paymentInfo}>
            <Text style={{flex: 1, fontSize: 14}}>Net payable</Text>
            <Text style={{fontSize: 16}}> ₹{payableAmmount.toFixed(0)}</Text>
          </View>
        </View>
      </View>
    );
  };

  const paymentPopUpView = () => {
    return (
      <RBSheet
        height={400}
        ref={popupRef}
        closeOnDragDown={true}
        closeOnPressBack
        closeOnPressMask={true}
        customStyles={{
          wrapper: {
            backgroundColor: 'transparent',
          },
          container: {
            justifyContent: 'flex-start',
          },
          draggableIcon: {
            backgroundColor: 'white',
          },
        }}>
        <View style={styles.popUpContainer}>
          <View style={styles.paymentView}>
            <Text style={styles.payableAmountTitle}>Payment Amount</Text>
            <Text style={styles.payableAmountText}>
              ₹{payableAmmount.toFixed(2)}
            </Text>
          </View>
          <View style={styles.addressContainer}>
            <Image
              style={styles.addressImage}
              source={require('../images/delivery_icon.png')}
            />
            <View>
              <Text style={styles.addressTitle}>Address Used to delivery</Text>
              <Text
                style={
                  styles.addressInfoText
                }>{`${location.displayAddress}`}</Text>
            </View>
          </View>

          <ScrollView horizontal>
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                onPress={() => onPlaceOrder('COD')}
                style={styles.options}>
                <Image
                  style={styles.optionIcon}
                  source={require('../images/cod.png')}
                />
                <Text style={styles.optionText}>Cash on Delivery</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                onPress={() => setIsPayment(true)}
                style={styles.options}>
                <Image
                  style={styles.optionIcon}
                  source={require('../images/visa.png')}
                />
                <Text style={styles.optionText}>Card Payment</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </RBSheet>
    );
  };

  if (cart.length) {
    if (isPayment) {
      return (
        <CardPayment
          onPaymentSuccess={onPaymentSuccess}
          onPaymentFailed={onPaymentFailed}
          onPaymentCancel={onPaymentCancel}
          amount={payableAmmount}
        />
      );
    }
    return (
      <View style={styles.mainContainer}>
        <View style={styles.navigation}>
          <View style={styles.myCartContainer}>
            <Text style={styles.addressTitle}>My Cart</Text>
            {user.token !== undefined && (
              <TouchableOpacity
                onPress={() => navigate('OrderScreen')}
                style={{alignItems: 'center'}}>
                <Image
                  style={styles.addressImage}
                  source={require('../images/orders.png')}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.body}>
          <FlatList
            style={{width: '100%'}}
            showsVerticalScrollIndicator={false}
            data={cart}
            renderItem={({item}) => (
              <FoodCardInfo
                onTap={() => {}}
                item={checkExistence(item, cart)}
                onUpdateCart={onUpdateCart}
              />
            )}
            keyExtractor={item => item._id}
            ListFooterComponent={footerContent()}
          />
        </View>
        <View style={styles.footer}>
          <View style={styles.amountView}>
            <Text style={styles.amountText}>Total</Text>
            <Text style={styles.amountText}> ₹{payableAmmount.toFixed(0)}</Text>
          </View>
          <ButtonWithTitle
            title="Make Payment"
            onTap={onValidateOrder}
            width={320}
            height={50}
          />
        </View>
        {paymentPopUpView()}
      </View>
    );
  } else {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.navigation}>
          <View style={styles.myCartContainer}>
            <Text style={styles.addressTitle}>My Cart</Text>
            {user.token !== undefined && (
              <TouchableOpacity
                onPress={() => navigate('OrderScreen')}
                style={{alignItems: 'center'}}>
                <Image
                  style={styles.addressImage}
                  source={require('../images/orders.png')}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.body}>
          <Text style={styles.emptyCartText}>Your Cart is empty!!</Text>
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
    flex: 9.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flex: 1.5,
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
  footerContent: {
    flex: 1,
  },
  row: {
    backgroundColor: 'white',
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderColor: '#D3D3D3',
    borderWidth: 1,
    marginHorizontal: 10,
    borderRadius: 10,
    height: 80,
    marginBottom: 15,
  },
  offersText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#525252',
    marginBottom: 10,
  },
  appliedMessage: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3D933F',
  },
  canApplyMessage: {
    color: '#EE6840',
    fontSize: 16,
  },
  billingMainContainer: {
    height: 250,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  paymentInfo: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
});

const mapStateToProps = (state: ApplicationState) => ({
  shoppingReducer: state.shoppingReducer,
  userReducer: state.userReducer,
});

export default connect(mapStateToProps, {
  onUpdateCart,
  onCreateOrder,
  onApplyRemoveOffer,
})(CartScreen);
// rockglumac3@hotmail.com
// 0147258369+-+-
