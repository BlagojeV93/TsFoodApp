import {
  CardField,
  CardFieldInput,
  useConfirmPayment,
  BillingDetails,
  PaymentIntent,
} from '@stripe/stripe-react-native';
import axios from 'axios';
import React, {useState} from 'react';
import {View, StyleSheet, Text, TextInput} from 'react-native';
import {ButtonWithTitle} from './ButtonWithTitle';

interface CardPaymentProps {
  onPaymentSuccess: (response: PaymentIntent.Result) => void;
  onPaymentFailed: (response: string) => void;
  onPaymentCancel: () => void;
  amount: number;
}

const CardPayment: React.FC<CardPaymentProps> = ({
  onPaymentCancel,
  onPaymentFailed,
  onPaymentSuccess,
  amount,
}) => {
  const [name, setName] = useState('');
  const {confirmPayment, loading} = useConfirmPayment();

  const initPayment = async () => {
    const response = await axios.post(
      'http://localhost:4000/create-payment-intent',
      {
        amount,
        currency: 'inr',
        paymentMethod: 'card',
      },
    );

    if (response?.data) {
      const clientSecret = response?.data.clientSecret;
      console.log(clientSecret)
      const billingDetails: BillingDetails = {
        name,
      };
      const {error, paymentIntent} = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails
        }
      });
      if (error) {
        onPaymentFailed(error.message);
      } else {
        onPaymentSuccess(paymentIntent);
      }
    } else {
      onPaymentFailed('Client secret not fount')
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.navigation}>
        <View style={styles.myCartContainer}>
          <Text style={styles.addressTitle}>Payment</Text>
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.amountMainView}>
          <View style={styles.amountView}>
            <Text style={styles.amountText}>Payable Total</Text>
            <Text style={styles.amountText}> ₹{amount.toFixed(0)}</Text>
          </View>
        </View>
        <View style={styles.creditCard}>
          <TextInput
            autoCapitalize="none"
            placeholder="Name on Card"
            keyboardType="name-phone-pad"
            onChange={e => setName(e.nativeEvent.text)}
            style={styles.input}
          />
          <CardField
            placeholders={{
              number: '0000 0000 0000 0000',
            }}
            onCardChange={cardDetails => {
              // console.log(cardDetails);
            }}
            onFocus={focusField => {
              // console.log('focus on ', focusField);
            }}
            cardStyle={inputStyle}
            style={styles.cardFields}
          />
        </View>
        <ButtonWithTitle
          isNoBg
          title="Cancel Payment"
          onTap={onPaymentCancel}
          width={320}
          height={50}
          disabled={loading}
        />
        <ButtonWithTitle
          title="Pay"
          onTap={initPayment}
          width={320}
          height={50}
          disabled={loading}
        />
      </View>
      <View style={styles.footer}></View>
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
    flex: 9.5,
  },
  footer: {
    flex: 1.5,
    padding: 10,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  myCartContainer: {
    height: 60,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
    paddingHorizontal: 20,
  },
  creditCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    padding: 12,
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 50,
    borderWidth: 5,
    borderColor: '#D3D3D3',
  },
  cardFields: {
    width: '100%',
    height: 50,
    marginVertical: 30,
  },
  input: {
    height: 44,
    fontSize: 17,
    borderBottomColor: '#DEDEDE',
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  amountMainView: {
    marginTop: 60,
    marginBottom: 30,
  },
  amountView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  amountText: {
    fontSize: 18,
  },
});

const inputStyle: CardFieldInput.Styles = {
  borderWidth: 0,
  backgroundColor: '#FFF',
  borderColor: 'black',
  borderRadius: 8,
  fontSize: 16,
  placeholderColor: '#999'
};

export {CardPayment};
