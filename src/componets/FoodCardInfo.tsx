import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';
import {FoodModel} from '../redux';
import { getImage } from '../utils/imageHelper';
import {ButtonAddRemove} from './ButtonAddRemove';

interface FoodCardInfoProps {
  item: FoodModel;
  onTap: Function;
  onUpdateCart: Function
}

const FoodCardInfo: React.FC<FoodCardInfoProps> = ({item, onTap, onUpdateCart}) => {

const updateCartHandler = (unit: number) => {
  item.unit = unit
  onUpdateCart(item)
}

  return (
    <View style={styles.mainContainer}>
      <View style={styles.mainButton}>
        <View style={styles.foodInfoContainer}>
          <Text style={styles.nameText}>{item.name}</Text>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <View style={styles.foodPriceContainer}>
          <Text style={styles.priceText}>{item.price}</Text>
          <ButtonAddRemove onAdd={() => {
            let unit = isNaN(item.unit) ? 0 : item.unit
            updateCartHandler(unit + 1)
          }} onRemove={() => {
            let unit = isNaN(item.unit) ? 0 : item.unit
            updateCartHandler(unit > 0 ? unit - 1 : unit)
          }} unit={item.unit} />
        </View>
      </View>
    </View>
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
    backgroundColor: 'white'
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  mainButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  foodInfoContainer: {
    flex: 8,
    padding: 10,
    marginTop: 10,
    paddingLeft:20
  },
  foodPriceContainer: {
    flex: 4,
    padding: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginRight: 10
  },
  priceText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7C7C7C',
  },
  nameText: {
    fontSize: 22,
    fontWeight: '500'
  },
  categoryText: {
    fontWeight: '600'
  }
});

export {FoodCardInfo};
