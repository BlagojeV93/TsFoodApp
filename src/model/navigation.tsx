import {NavigatorScreenParams, ParamListBase} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {FoodModel, OrderModel, Resturant} from '../redux';

export type HomeStackParamList = {
  HomeScreen: undefined;
  Search: undefined;
  ResturantScreen: {item: Resturant};
  FoodDetails: {item: FoodModel};
  LocationScreen: undefined;
};

export type CartStackParamList = {
  CartScreen: undefined;
  LoginScreen: undefined;
  OrderScreen: undefined;
  OrderDetailsScreen: {order: OrderModel};
  OffersScreen: undefined;
};

export type AccountStackParamList = {
  AccountScreen: undefined;
  AccountOrderScreen: undefined;
  OrderDetailScreen: {order: OrderModel};
};

export type TabsParamList = {
  Home:  NavigatorScreenParams<HomeStackParamList> | undefined;
  Cart: CartStackParamList;
  Account: AccountStackParamList;
  Offer: undefined;
};

export type RootStackParamList = {
  Landing: undefined;
  Tabs: NavigatorScreenParams<TabsParamList>;
  LocationScreen: undefined;
};

export type NavigationType<T extends ParamListBase> =
  NativeStackNavigationProp<T>;
