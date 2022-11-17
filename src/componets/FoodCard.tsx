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

interface FoodCardProps {
  item: FoodModel;
  onTap: Function;
  onUpdateCart: Function;
  unit?: number | undefined
}

const FoodCard: React.FC<FoodCardProps> = ({item, onTap, onUpdateCart, unit}) => {

const updateCartHandler = (unit: number) => {
  item.unit = unit
  onUpdateCart(item)
}

  return (
    <View style={styles.mainContainer}>
      <Image source={{uri: `${getImage(item.images[0])}`}} style={styles.image} />
      <TouchableOpacity onPress={() => onTap(item)} style={styles.mainButton}>
        <View style={styles.foodInfoContainer}>
          <Text>{item.name}</Text>
          <Text>{item.category}</Text>
        </View>
        <View style={styles.foodPriceContainer}>
          <Text style={styles.priceText}>{item.price}</Text>
          {unit ? <Text style={styles.unitText}>Qty: {unit}</Text>          
        :
        <ButtonAddRemove onAdd={() => {
          let unit = isNaN(item.unit) ? 0 : item.unit
          updateCartHandler(unit + 1)
        }} onRemove={() => {
          let unit = isNaN(item.unit) ? 0 : item.unit
          updateCartHandler(unit > 0 ? unit - 1 : unit)
        }} unit={item.unit} />
        
        }
        </View>
      </TouchableOpacity>
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
    fontWeight: '700'
  }
});

export {FoodCard};
