import axios from 'axios';
import {Dispatch} from 'react';
import {LocationGeocodedLocation} from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  FoodModel,
  OrderModel,
  PickedAddress,
  PickedAddressResult,
  UserModel,
} from '../models';
import {BASE_URL, GOOGLE_MAP_KEY} from '../../utils';

export interface Address {
  displayAddress: string;
  postalCode: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdateLocationAction {
  readonly type: 'ON_UPDATE_LOCATION';
  payload: any;
}

export interface UserErrorAction {
  readonly type: 'ON_USER_ERROR';
  payload: any;
}

export interface UpdateCartAction {
  readonly type: 'ON_UPDATE_CART';
  payload: FoodModel;
}

export interface UserLogin {
  readonly type: 'USER_LOGIN';
  payload: UserModel;
}

export interface CreateOrderAction {
  readonly type: 'ON_CREATE_ORDER';
  payload: OrderModel;
}

export interface ViewOrderAction {
  readonly type: 'ON_VIEW_ORDER' | 'ON_CANCEL_ORDER';
  payload: OrderModel[];
}

export interface LogoutAction {
  readonly type: 'ON_USER_LOGOUT';
}

export interface OnFetchLocationAction {
  readonly type: 'ON_FETCH_LOCATION';
  payload: PickedAddress;
}

export type UserAction =
  | UpdateLocationAction
  | UserErrorAction
  | UpdateCartAction
  | UserLogin
  | CreateOrderAction
  | ViewOrderAction
  | LogoutAction
  | OnFetchLocationAction;

// actions triggered from components

export const onUpdateLocation =
  (location: Address) =>
  async (dispatch: Dispatch<UserAction>) => {
    try {
      const locationString = JSON.stringify(location);
      await AsyncStorage.setItem('user_location', locationString);
      dispatch({
        type: 'ON_UPDATE_LOCATION',
        payload: location,
      });
    } catch (error) {
      dispatch({
        type: 'ON_USER_ERROR',
        payload: error,
      });
    }
  };

export const onUpdateCart =
  (item: FoodModel) => (dispatch: Dispatch<UserAction>) => {
    dispatch({
      type: 'ON_UPDATE_CART',
      payload: item,
    });
  };

export const onUserLogin =
  (email: string, password: string) =>
  async (dispatch: Dispatch<UserAction>) => {
    try {
      const response = await axios.post<UserModel>(`${BASE_URL}/user/login`, {
        email,
        password,
      });
      if (!response) {
        dispatch({
          type: 'ON_USER_ERROR',
          payload: 'User login error',
        });
      } else {
        dispatch({type: 'USER_LOGIN', payload: response.data});
      }
    } catch (error) {
      dispatch({
        type: 'ON_USER_ERROR',
        payload: error,
      });
    }
  };

export const onUserSignup =
  (email: string, phone: string, password: string) =>
  async (dispatch: Dispatch<UserAction>) => {
    try {
      const response = await axios.post<UserModel>(
        `${BASE_URL}/user/create-account`,
        {
          email,
          phone,
          password,
        },
      );
      if (!response) {
        dispatch({
          type: 'ON_USER_ERROR',
          payload: 'User login error',
        });
      } else {
        dispatch({type: 'USER_LOGIN', payload: response.data});
      }
    } catch (error) {
      console.log(error);
      dispatch({
        type: 'ON_USER_ERROR',
        payload: error,
      });
    }
  };

export const onVerifyOtp =
  (otp: string, user: UserModel) => async (dispatch: Dispatch<UserAction>) => {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
      const response = await axios.patch<UserModel>(`${BASE_URL}/user/verify`, {
        otp,
      });
      if (!response) {
        dispatch({
          type: 'ON_USER_ERROR',
          payload: 'User verification error',
        });
      } else {
        dispatch({type: 'USER_LOGIN', payload: response.data});
      }
    } catch (error) {
      dispatch({
        type: 'ON_USER_ERROR',
        payload: error,
      });
    }
  };

export const onRequestOtp =
  (user: UserModel) => async (dispatch: Dispatch<UserAction>) => {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
      const response = await axios.get<UserModel>(`${BASE_URL}/user/otp`);
      if (!response) {
        dispatch({
          type: 'ON_USER_ERROR',
          payload: 'User verification error',
        });
      } else {
        dispatch({type: 'USER_LOGIN', payload: response.data});
      }
    } catch (error) {
      dispatch({
        type: 'ON_USER_ERROR',
        payload: error,
      });
    }
  };

export const onCreateOrder =
  (cartItems: FoodModel[], user: UserModel, paymentResponse: string) =>
  async (dispatch: Dispatch<UserAction>) => {
    const cart = cartItems.map(item => ({_id: item._id, unit: item.unit}));
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
      const response = await axios.post<OrderModel>(
        `${BASE_URL}/user/create-order`,
        {
          cart,
          paymentResponse
        },
      );
      if (!response) {
        dispatch({
          type: 'ON_USER_ERROR',
          payload: 'Create order action error',
        });
      } else {
        dispatch({type: 'ON_CREATE_ORDER', payload: response.data});
      }
    } catch (error) {
      dispatch({
        type: 'ON_USER_ERROR',
        payload: error,
      });
    }
  };

export const onGetOrders =
  (user: UserModel) => async (dispatch: Dispatch<UserAction>) => {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
      const response = await axios.get<OrderModel[]>(`${BASE_URL}/user/order`);
      if (!response) {
        dispatch({
          type: 'ON_USER_ERROR',
          payload: 'Create order action error',
        });
      } else {
        dispatch({type: 'ON_VIEW_ORDER', payload: response.data});
      }
    } catch (error) {
      dispatch({
        type: 'ON_USER_ERROR',
        payload: error,
      });
    }
  };

export const onCancelOrder =
  (order: OrderModel, user: UserModel) =>
  async (dispatch: Dispatch<UserAction>) => {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
      const response = await axios.delete<OrderModel[]>(
        `${BASE_URL}/user/order/${order._id}`,
      );
      if (!response) {
        dispatch({
          type: 'ON_USER_ERROR',
          payload: 'Create order action error',
        });
      } else {
        dispatch({type: 'ON_CANCEL_ORDER', payload: response.data});
      }
    } catch (error) {
      dispatch({
        type: 'ON_USER_ERROR',
        payload: error,
      });
    }
  };

export const onLogout = () => async (dispatch: Dispatch<UserAction>) => {
  try {
    dispatch({
      type: 'ON_USER_LOGOUT',
    });
  } catch (error) {
    dispatch({
      type: 'ON_USER_ERROR',
      payload: error,
    });
  }
};

export const onFetchLocation =
  (lat: string, lng: string) => async (dispatch: Dispatch<UserAction>) => {
    try {
      const response = await axios.get<PickedAddressResult>(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${lat},${lng}&key=${GOOGLE_MAP_KEY}`,
      );
      if (!response) {
        dispatch({
          type: 'ON_USER_ERROR',
          payload: 'Address Fetching error',
        });
      } else {
        const {results} = response.data;
        if (results.length) {
          const address = results[0];
          dispatch({type: 'ON_FETCH_LOCATION', payload: address});
        }
      }
    } catch (error) {
      dispatch({
        type: 'ON_USER_ERROR',
        payload: error,
      });
    }
  };
