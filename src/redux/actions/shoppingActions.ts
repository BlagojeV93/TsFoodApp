import axios from 'axios';
import {Dispatch} from 'react';
import {BASE_URL} from '../../utils';
import {FoodAvailability, FoodModel, OfferModel} from '../models';

export interface AvailabilityAction {
  readonly type: 'ON_AVAILABILITY';
  payload: FoodAvailability;
}

export interface ShoppingErrorAction {
  readonly type: 'ON_SHOPPING_ERROR';
  payload: any;
}

export interface FoodSearchAction {
  readonly type: 'ON_FOODS_SEARCH';
  payload: FoodModel[];
}

export interface OffersAction {
  readonly type: 'ON_GET_OFFERS';
  payload: OfferModel[];
}

export interface ApplyOfferAction {
  readonly type: 'ON_APPLY_OFFER' | 'ON_REMOVE_OFFER';
  payload: OfferModel;
}

export type ShoppingAction =
  | AvailabilityAction
  | ShoppingErrorAction
  | FoodSearchAction
  | OffersAction
  | ApplyOfferAction;

// actions triggered from components

export const getAvailability =
  (postalCode: string) => async (dispatch: Dispatch<ShoppingAction>) => {
    try {
      const response = await axios.get<FoodAvailability>(
        `${BASE_URL}/food/availability/${postalCode}`,
      );
      if (!response) {
        dispatch({
          type: 'ON_SHOPPING_ERROR',
          payload: 'Availability error',
        });
      } else {
        dispatch({
          type: 'ON_AVAILABILITY',
          payload: response.data,
        });
      }
    } catch (error) {
      dispatch({
        type: 'ON_SHOPPING_ERROR',
        payload: error,
      });
    }
  };

export const onSearchFoods =
  (postalCode: string) => async (dispatch: Dispatch<ShoppingAction>) => {
    try {
      const response = await axios.get<FoodModel[]>(
        `${BASE_URL}/food/search/${postalCode}`,
      );
      if (!response) {
        dispatch({
          type: 'ON_SHOPPING_ERROR',
          payload: 'Availability error',
        });
      } else {
        dispatch({
          type: 'ON_FOODS_SEARCH',
          payload: response.data,
        });
      }
    } catch (error) {
      dispatch({
        type: 'ON_SHOPPING_ERROR',
        payload: error,
      });
    }
  };

export const onGetOffers =
  (postcode: string) => async (dispatch: Dispatch<ShoppingAction>) => {
    try {
      const response = await axios.get<OfferModel[]>(
        `${BASE_URL}/food/offers/${postcode}`,
      );
      if (!response) {
        dispatch({
          type: 'ON_SHOPPING_ERROR',
          payload: 'Get offers error',
        });
      } else {
        dispatch({type: 'ON_GET_OFFERS', payload: response.data});
      }
    } catch (error) {
      dispatch({
        type: 'ON_SHOPPING_ERROR',
        payload: error,
      });
    }
  };

export const onApplyRemoveOffer =
  (offer: OfferModel, remove: boolean) =>
  async (dispatch: Dispatch<ShoppingAction>) => {
    if (remove) {
      dispatch({
        type: 'ON_REMOVE_OFFER',
        payload: offer,
      });
    } else {
      dispatch({
        type: 'ON_APPLY_OFFER',
        payload: offer,
      });
    }
  };
