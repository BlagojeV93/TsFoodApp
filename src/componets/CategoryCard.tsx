import React from 'react';
import {StyleSheet, TouchableOpacity, Image, Text} from 'react-native';
import {Category} from '../redux';

interface CategoryCardProps {
  item: Category;
  onTap: (item: Category) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({item, onTap}) => {
  return (
    <TouchableOpacity style={styles.mainContainer} onPress={() => onTap(item)}>
      <Image source={{uri: `${item.icon}`}} style={styles.image} />
      <Text style={styles.cardText}>{item.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    width: 120,
    height: 140,
    justifyContent: 'space-around',
    alignItems: 'center',
    margin: 5,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 20,
    backgroundColor: '#EAEAEA'
  },
  cardText: {
    fontSize: 14,
    marginTop: 10,
    color: '#858585',
  },
});

export {CategoryCard};
