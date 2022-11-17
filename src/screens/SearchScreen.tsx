import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {connect} from 'react-redux';
import {ButtonWithIcon, FoodCard, SearchBar} from '../componets';
import {HomeStackParamList, NavigationType} from '../model/navigation';
import {
  ApplicationState,
  ShoppingState,
  UserState,
  onUpdateCart,
  FoodModel,
} from '../redux';
import {checkExistence} from '../utils';

interface SearchScreenProps {
  shoppingReducer: ShoppingState;
  userReducer: UserState;
  onUpdateCart: Function;
}

const SearchScreen: React.FC<SearchScreenProps> = ({
  shoppingReducer,
  userReducer,
  onUpdateCart,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [keyword, setKeyword] = useState('');

  const {navigate} = useNavigation<NavigationType<HomeStackParamList>>();
  const {availableFoods} = shoppingReducer;
  const {cart} = userReducer;

  const onTapFood = (item: FoodModel) => {
    navigate('FoodDetails', {item});
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.navigation}>
        <View style={styles.innerNavigation}>
          <ButtonWithIcon
            icon={require('../images/back_arrow.png')}
            onTap={() => navigate('HomeScreen')}
            width={40}
            height={50}
          />
          <SearchBar
            onTextChange={setKeyword}
            onEndEditing={() => setIsEditing(false)}
            didTouch={() => setIsEditing(true)}
          />
        </View>
      </View>
      <View style={styles.body}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={
            isEditing
              ? availableFoods.filter(item => {
                  return item.name.includes(keyword);
                })
              : availableFoods
          }
          renderItem={({item}) => (
            <FoodCard
              onTap={() => onTapFood(item)}
              item={checkExistence(item, cart)}
              onUpdateCart={onUpdateCart}
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
});

const mapStateToProps = (state: ApplicationState) => ({
  shoppingReducer: state.shoppingReducer,
  userReducer: state.userReducer,
});

export default connect(mapStateToProps, {onUpdateCart})(SearchScreen);
