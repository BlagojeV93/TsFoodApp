import {ShoppingAction} from '../actions/shoppingActions';
import {
  FoodAvailability,
  FoodModel,
  OfferModel,
  ShoppingState,
} from '../models';

const initialState = {
  availability: {} as FoodAvailability,
  availableFoods: [] as FoodModel[],
  offers: [] as OfferModel[],
  appliedOffer: {} as OfferModel,
};

const ShoppingReducer = (
  state: ShoppingState = initialState,
  action: ShoppingAction,
) => {
  switch (action.type) {
    case 'ON_AVAILABILITY':
      return {...state, availability: action.payload};
    case 'ON_FOODS_SEARCH':
      return {...state, availableFoods: action.payload};
    case 'ON_GET_OFFERS':
      return {...state, offers: action.payload};
    case 'ON_APPLY_OFFER':
      return {...state, appliedOffer: action.payload};
    case 'ON_REMOVE_OFFER':
      return {...state, appliedOffer: {}};
    default:
      return state;
  }
};

export {ShoppingReducer};
