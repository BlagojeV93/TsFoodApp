import React from 'react';
import {StyleSheet, Dimensions, TouchableOpacity, Image} from 'react-native';
import {FoodModel, Resturant} from '../redux';
import { getImage } from '../utils/imageHelper';

const screenWidth = Dimensions.get('screen').width;

interface ResturantCardProps {
  item: Resturant | FoodModel;
  onTap: Function;
}

const ResturantCard: React.FC<ResturantCardProps> = ({item, onTap}) => {
  const uri = getImage(item.images[0])
  return (
    <TouchableOpacity onPress={() => onTap(item)} style={styles.mainContainer}>
      <Image style={styles.image} source={{uri}} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    width: screenWidth - 20,
    height: 230,
    justifyContent: 'space-around',
    alignItems: 'center',
    margin: 10,
    borderRadius: 20,
  },
  image: {
    width: screenWidth - 20,
    height: 220,
    borderRadius: 20,
    backgroundColor: '#EAEAEA',
  },
});

export {ResturantCard};
