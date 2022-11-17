import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import { AccountStackParamList } from '../model/navigation';
import {ApplicationState, UserState, onLogout} from '../redux';
import LoginScreen from './LoginScreen';

interface AccountScreenProps {
  userReducer: UserState;
  onLogout: Function
}

const AccountScreen: React.FC<AccountScreenProps> = ({userReducer, onLogout}) => {
  const {user} = userReducer;
  const { navigate } = useNavigation<NavigationProp<AccountStackParamList>>()

  const options = [
    {title: 'Edit Profile', action: () => {}},
    {title: 'View Orders', action: () => navigate('AccountOrderScreen')},
    {title: 'Contact Support', action: () => {}},
    {title: 'Logout', action: () => onLogout()},
  ];

  const optionCard = (title: string, action: Function) => {
    return (
      <TouchableOpacity style={styles.optionCard} onPress={() => action()}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Image
          style={styles.optionImage}
          source={require('../images/arrow_icon.png')}
        />
      </TouchableOpacity>
    );
  };

  if (user.token) {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.navigation}>
          <View style={styles.myCartContainer}>
            <Image
              source={require('../images/avatar.png')}
              style={styles.imageStyle}
            />
            <View>
              <Text style={styles.firstName}>{user.firstName || 'Guest'}</Text>
              <Text style={styles.email}>{user.email}</Text>
            </View>
          </View>
        </View>
        <View style={styles.body}>
          <ScrollView>
            {options.map(({title, action}) => {
              return <View key={title}>{optionCard(title, action)}</View>;
            })}
          </ScrollView>
        </View>
      </View>
    );
  } else {
    return <LoginScreen />;
  }
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  navigation: {
    flex: 3,
    marginTop: 43,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  innerNavigation: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  body: {
    flex: 9,
  },
  footer: {
    flex: 2,
    padding: 10,
  },
  amountView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  amountText: {
    fontSize: 18,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 25,
    fontWeight: '700',
  },
  popUpContainer: {
    justifyContent: 'space-around',
    width: '100%',
  },
  payableAmountTitle: {
    fontSize: 20,
  },
  payableAmountText: {
    fontSize: 20,
    fontWeight: '600',
  },
  paymentView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    margin: 5,
    backgroundColor: '#E3BE74',
  },
  addressContainer: {
    height: 100,
    padding: 20,
    flexDirection: 'row',
  },
  addressImage: {
    width: 50,
    height: 50,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  addressInfoText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 5,
    width: Dimensions.get('screen').width - 60,
  },
  optionsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 20,
  },
  options: {
    height: 120,
    width: 160,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderColor: '#A0A0A0',
    backgroundColor: '#F2F2F2',
    borderWidth: 0.2,
    borderRadius: 10,
    margin: 10,
  },
  optionIcon: {
    width: 115,
    height: 80,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#545252',
  },
  myCartContainer: {
    height: 60,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
    paddingHorizontal: 20,
  },
  imageStyle: {
    width: 100,
    height: 100,
    marginRight: 20,
  },
  firstName: {
    fontSize: 22,
    fontWeight: '600',
  },
  email: {
    fontSize: 16,
  },
  optionCard: {
    backgroundColor: 'white',
    height: 80,
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingLeft: 50,
    paddingRight: 20,
    borderTopColor: '#D3D3D3',
    borderBottomColor: '#D3D3D3',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
  },
  optionImage: {
    width: 40,
    height: 40,
  },
  optionTitle: {
    flex: 1,
    fontSize: 18,
    color: '#525252',
  },
});

const mapStateToProps = (state: ApplicationState) => ({
  userReducer: state.userReducer,
});

export default connect(mapStateToProps, {onLogout})(AccountScreen);
// rockglumac3@hotmail.com
// 0147258369+-+-
