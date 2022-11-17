import { useNavigation } from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, ScrollView, FlatList, Image} from 'react-native';
import {connect} from 'react-redux';
import {
  ButtonWithIcon,
  CategoryCard,
  ResturantCard,
  SearchBar,
} from '../componets';
import { HomeStackParamList, NavigationType } from '../model/navigation';
import {
  ApplicationState,
  UserState,
  getAvailability,
  ShoppingState,
  Resturant,
  FoodModel,
  onSearchFoods
} from '../redux';

interface HomeProps {
  getAvailability: Function;
  onSearchFoods: Function;
  userReducer: UserState;
  shoppingReducer: ShoppingState;
}

const HomeScreen: React.FC<HomeProps> = props => {
  const {navigate} = useNavigation<NavigationType<HomeStackParamList>>();
  const {userReducer, getAvailability, shoppingReducer, onSearchFoods} = props;
  const {location} = userReducer;
  const {availability} = shoppingReducer;
  const {categories, foods, restaurants} = availability;

  useEffect(() => {
    getAvailability(location.postalCode);
    setTimeout(() => {
        onSearchFoods(location.postalCode)
    }, 1500)
  }, [location]);

  const onTapResturant = (item: Resturant) => {
    navigate('ResturantScreen', {item});
  };

  const onTapFood = (item: FoodModel) => {
    navigate('FoodDetails', {item});
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.navigation}>
        <View style={styles.addressBar}>
          <Image style={styles.locationIcon} source={require('../images/delivery_icon.png')} />
          <Text style={styles.locationText}>{location.displayAddress}</Text>
          <ButtonWithIcon 
            onTap={() => navigate('LocationScreen')}
            icon={require('../images/edit_icon.png')}
            width={24}
            height={24}
          />
        </View>
        <View style={styles.searchBarContainer}>
          <SearchBar
            onTextChange={() => {}}
            didTouch={() => {
              navigate('Search');
            }}
          />
          <ButtonWithIcon
            onTap={() => {}}
            icon={require('../images/hambar.png')}
            width={50}
            height={40}
          />
        </View>
      </View>

      <View style={styles.body}>
        <ScrollView>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            renderItem={({item}) => (
              <CategoryCard item={item} onTap={() => console.log('TAPED')} />
            )}
            keyExtractor={item => item.id}
          />

          <Text style={styles.sectionTitle}>Top Resturants</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={restaurants}
            renderItem={({item}) => (
              <ResturantCard item={item} onTap={onTapResturant} />
            )}
            keyExtractor={item => item._id}
          />

          <Text style={styles.sectionTitle}>Top Foods</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={foods}
            renderItem={({item}) => (
              <ResturantCard item={item} onTap={onTapFood} />
            )}
            keyExtractor={item => item._id}
          />
        </ScrollView>
      </View>

      <View style={styles.footer} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  navigation: {
    flex: 2,
  },
  body: {
    flex: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flex: 1,
  },
  addressBar: {
    marginTop: 50,
    flex: 4,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  searchBarContainer: {
    height: 60,
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 25,
    fontWeight: '600',
    color: '#f15b5d',
    marginLeft: 20,
  },
  locationIcon: {
    width: 32,
    height: 32
  },
  locationText: {
    width: 280,
    marginRight: 5
  }
});

const mapStateToProps = (state: ApplicationState) => ({
  userReducer: state.userReducer,
  shoppingReducer: state.shoppingReducer,
});

export default connect(mapStateToProps, {getAvailability, onSearchFoods})(HomeScreen);
