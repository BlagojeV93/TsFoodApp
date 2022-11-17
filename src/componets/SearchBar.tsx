import React from 'react';
import {View, StyleSheet, Image, TextInput} from 'react-native';

interface SearchBarProps {
  onEndEditing?: any | undefined;
  didTouch?: any | undefined;
  autoFocus?: boolean | undefined;
  onTextChange: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onEndEditing,
  didTouch,
  autoFocus = false,
  onTextChange,
}) => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.searchBar}>
        <Image style={styles.image} source={require('../images/search.png')}/>
        <TextInput 
          style={styles.input}
          placeholder='Search Foods'
          autoFocus={autoFocus}
          onTouchStart={didTouch}
          onChangeText={(text) => onTextChange(text)}
          onEndEditing={onEndEditing}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  searchBar: {
    flex: 1,
    height: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ededed',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 10,
    borderColor: '#E5E5E5',
    borderWidth: 2,
  },
  image: {
    height: 25,
    width: 25
  },
  input: {
    marginLeft: 5,
    flex: 9,
    fontSize: 20,
    height: 42
  }
});

export {SearchBar};
