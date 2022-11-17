import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';
import {FoodModel, OfferModel} from '../redux';
import {getImage} from '../utils/imageHelper';
import {ButtonAddRemove} from './ButtonAddRemove';

interface OfferCardProps {
  item: OfferModel;
  onTapApply: (item: OfferModel) => void;
  onTapRemove: (item: OfferModel) => void;
  isApplied: boolean;
}

const OfferCard: React.FC<OfferCardProps> = ({
  item,
  onTapApply,
  onTapRemove,
  isApplied,
}) => {
  return (
    <View style={styles.mainContainer}>
      <Image
        source={{uri: `${getImage(item.images[0])}`}}
        style={styles.image}
      />
      <View style={styles.mainButton}>
        <View style={styles.foodInfoContainer}>
          <Text style={styles.titleText}>{item.title}</Text>
          <Text style={styles.descText}>{item.description}</Text>
        </View>
        <View style={styles.applyPromoOutterContainer}>
          {isApplied ? (
            <TouchableOpacity
              onPress={() => onTapRemove(item)}
              style={[
                styles.applyPromoContainer,
                {backgroundColor: '#FF4673'},
              ]}>
              <Text style={styles.applyPromoText}>Remove</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => onTapApply(item)}
              style={[styles.applyPromoContainer, {flexDirection: 'column'}]}>
              <Text style={styles.applyPromoText}>Apply</Text>
              <Text style={[styles.applyPromoText, {fontSize: 13}]}>
                {item.promoCode}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: Dimensions.get('screen').width - 20,
    margin: 10,
    borderRadius: 20,
    height: 270,
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#EFCA5F',
  },
  image: {
    width: Dimensions.get('screen').width - 20,
    height: 200,
    borderRadius: 20,
  },
  mainButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  foodInfoContainer: {
    flex: 7.5,
    padding: 10,
  },
  foodPriceContainer: {
    flex: 4,
    padding: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7C7C7C',
  },
  unitText: {
    fontSize: 18,
    fontWeight: '700',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
  },
  descText: {
    fontSize: 12,
  },
  applyPromoOutterContainer: {
    flex: 4.5,
    padding: 10,
  },
  applyPromoContainer: {
    flexDirection: 'row',
    backgroundColor: '#8FC777',
    padding: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  applyPromoText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export {OfferCard};
