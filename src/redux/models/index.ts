import {LocationGeocodedAddress} from 'expo-location';
import { Address } from '../actions';

// category

export interface Category {
  id: string;
  title: string;
  icon: string;
}

// food model

export interface FoodModel {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  readyTime: number;
  images: string[];
  unit: number;
}

// resturant model

export interface Resturant {
  _id: string;
  name: string;
  foodType: string;
  address: string;
  phone: string;
  images: string;
  foods: FoodModel[];
}

export interface FoodAvailability {
  categories: Category[];
  restaurants: Resturant[];
  foods: FoodModel[];
}

// user model

export interface UserModel {
  firstName: string;
  lastName: string;
  email: string;
  token: string;
  verified: boolean;
}

export interface UserState {
  user: UserModel;
  location: Address;
  error: string | undefined;
  cart: FoodModel[];
  orders: OrderModel[];
  pickedAddress: PickedAddress
}

export interface ShoppingState {
  availability: FoodAvailability;
  availableFoods: FoodModel[];
  offers: OfferModel[];
  appliedOffer: OfferModel;
}

export interface CartModel {
  _id: string;
  food: FoodModel;
  unit: number;
}

export interface OrderModel {
  _id: string;
  orderID: string;
  items: CartModel[];
  totalAmount: number;
  orderDate: Date;
  paidThrough: string;
  paymentResponse: string;
  orderStatus: string;
}

export interface OfferModel {
  _id: string;
  offerType: string;
  vendors: any[];
  images: string[];
  title: string;
  description: string;
  minValue: number;
  offerAmount: number;
  offerPercentage: number;
  startValidity: Date;
  endValidity: Date;
  promoCode: string;
  promoType: string;
  bank: any[];
  bin: any[];
  pincode: string;
}

export interface PickedAddress {
  address_components: [
    {
      long_name: string;
      short_name: string;
      types: string[];
    },
  ];
  formatted_address: string;
  place_id: string;
}

export interface PickedAddressResult {
  results: PickedAddress[];
}
