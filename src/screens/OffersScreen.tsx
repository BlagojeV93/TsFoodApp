import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, Text, Alert} from 'react-native';
import {connect} from 'react-redux';
import {OfferCard} from '../componets';
import {
  ApplicationState,
  ShoppingState,
  UserState,
  onGetOffers,
  OfferModel,
  onApplyRemoveOffer,
} from '../redux';

interface OffersScreenProps {
  shoppingReducer: ShoppingState;
  userReducer: UserState;
  onGetOffers: Function;
  onApplyRemoveOffer: (offer: OfferModel, remove: boolean) => void;
}

const OffersScreen: React.FC<OffersScreenProps> = ({
  shoppingReducer,
  userReducer,
  onGetOffers,
  onApplyRemoveOffer,
}) => {
  const {offers, appliedOffer} = shoppingReducer;
  const {cart} = userReducer;

  useEffect(() => {
    onGetOffers();
  }, []);

  const applyOfferHandler = (item: OfferModel) => {
    let total = 0;
    cart.map(food => {
      total += food.price * food.unit;
    });
    const taxAmount = (total / 100 * 0.9) + 40;
    const orderAmount = taxAmount + total;
    if (orderAmount >= item.minValue) {
      onApplyRemoveOffer(item, false);
      showAlert(
        'Offer Applied',
        `Offer Applied with discount of ${item.offerPercentage}`,
      );
    } else {
      showAlert(
        'This offer is not applicable!',
        `This offer is applicable with minimum order amout of ${item.minValue}`,
      );
    }
  };

  const showAlert = (title: string, msg: string) => {
    Alert.alert(title, msg, [{text: 'OK', onPress: () => {}}]);
  };

  const removeOfferHandler = (item: OfferModel) => {
    onApplyRemoveOffer(item, true);
  };

  const checkIfApplicable = (item: OfferModel) => {
    if (appliedOffer._id) {
      return item._id.toString() === appliedOffer._id.toString();
    }
    return false;
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.navigation}>
        <View style={styles.innerNavigation}>
          <Text style={styles.title}>Offers & Deals</Text>
        </View>
      </View>
      <View style={styles.body}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={offers}
          renderItem={({item}) => (
            <OfferCard
              item={item}
              onTapApply={applyOfferHandler}
              onTapRemove={removeOfferHandler}
              isApplied={checkIfApplicable(item)}
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
  title: {
    fontSize: 22,
    fontWeight: '600',
  },
});

const mapStateToProps = (state: ApplicationState) => ({
  shoppingReducer: state.shoppingReducer,
  userReducer: state.userReducer,
});

export default connect(mapStateToProps, {onGetOffers, onApplyRemoveOffer})(
  OffersScreen,
);
