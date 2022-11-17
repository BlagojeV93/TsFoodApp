import React from 'react';
import {Image, StyleSheet} from 'react-native';

import LandingScreen from './src/screens/LandingScreen';
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import ResturantScreen from './src/screens/ResturantScreen';
import FoodDetailScreen from './src/screens/FoodDetailScreen';
import CartScreen from './src/screens/CartScreen';
import LoginScreen from './src/screens/LoginScreen';
import OrderScreen from './src/screens/OrderScreen';
import OrderDetailsScreen from './src/screens/OrderDetailsScreen';
import AccountScreen from './src/screens/AccountScreen';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  AccountStackParamList,
  CartStackParamList,
  HomeStackParamList,
  RootStackParamList,
  TabsParamList,
} from './src/model/navigation';

import {Provider} from 'react-redux';
import {store} from './src/redux';
import OffersScreen from './src/screens/OffersScreen';
import LocationScreen from './src/screens/LocationScreen';
import {StripeProvider} from '@stripe/stripe-react-native';

const Stack = createNativeStackNavigator<RootStackParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const CartStack = createNativeStackNavigator<CartStackParamList>();
const AccountStack = createNativeStackNavigator<AccountStackParamList>();
const Tab = createBottomTabNavigator<TabsParamList>();

const HomeStacker = () => {
  return (
    <HomeStack.Navigator initialRouteName='HomeScreen' screenOptions={{headerShown: false}}>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
      <HomeStack.Screen name="Search" component={SearchScreen} />
      <HomeStack.Screen name="ResturantScreen" component={ResturantScreen} />
      <HomeStack.Screen name="FoodDetails" component={FoodDetailScreen} />
      <HomeStack.Screen name="LocationScreen" component={LocationScreen} />
    </HomeStack.Navigator>
  );
};

const CartStacker = () => {
  return (
    <CartStack.Navigator screenOptions={{headerShown: false}}>
      <CartStack.Screen name="CartScreen" component={CartScreen} />
      <CartStack.Screen name="LoginScreen" component={LoginScreen} />
      <CartStack.Screen name="OrderScreen" component={OrderScreen} />
      <CartStack.Screen
        name="OrderDetailsScreen"
        component={OrderDetailsScreen}
      />
      <CartStack.Screen name="OffersScreen" component={OffersScreen} />
    </CartStack.Navigator>
  );
};

const AccountStacker = () => {
  return (
    <AccountStack.Navigator>
      <AccountStack.Screen name="AccountScreen" component={AccountScreen} />
      <AccountStack.Screen name="AccountOrderScreen" component={OrderScreen} />
      <AccountStack.Screen
        name="OrderDetailScreen"
        component={OrderDetailsScreen}
      />
    </AccountStack.Navigator>
  );
};

const MyTabs = () => {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen
        options={{
          tabBarIcon: ({focused}) => {
            const icon = focused
              ? require('./src/images/home.png')
              : require('./src/images/home_n_icon.png');
            return <Image source={icon} style={styles.tabIcon} />;
          },
        }}
        name="Home"
        component={HomeStacker}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({focused}) => {
            const icon = focused
              ? require('./src/images/offer.jpg')
              : require('./src/images/offer_n_icon.png');
            return <Image source={icon} style={styles.tabIcon} />;
          },
        }}
        name="Offer"
        component={OffersScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({focused}) => {
            const icon = focused
              ? require('./src/images/cart_icon.png')
              : require('./src/images/cart_n_icon.png');
            return <Image source={icon} style={styles.tabIcon} />;
          },
        }}
        name="Cart"
        component={CartStacker}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({focused}) => {
            const icon = focused
              ? require('./src/images/account_icon.png')
              : require('./src/images/account_n_icon.png');
            return <Image source={icon} style={styles.tabIcon} />;
          },
        }}
        name="Account"
        component={AccountStacker}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <StripeProvider
        publishableKey='pk_test_51M1ssEAuPtAvp7nsE0qyJpsRlhnZ8Axga6AUjskdUfYtMQYGt17VcPW8mCnyVtqfTkLeVXQtQpWouPRS1nvlNvWi007ijUZg4Y'
        merchantIdentifier='org.reactjs.native.example.TsFoodApp'
        threeDSecureParams={{
          backgroundColor: 'white',
          timeout: 3
        }}
      >
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Landing" component={LandingScreen} />
            <Stack.Screen name="Tabs" component={MyTabs} />
            <Stack.Screen name="LocationScreen" component={LocationScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </StripeProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  tabIcon: {
    width: 30,
    height: 30,
  },
});

export default App;
