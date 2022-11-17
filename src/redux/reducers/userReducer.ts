import {UserAction, Address} from '../actions';
import {
  FoodModel,
  OrderModel,
  PickedAddress,
  UserModel,
  UserState,
} from '../models';

const initialState = {
  user: {} as UserModel,
  location: {} as Address,
  error: undefined,
  cart: [] as FoodModel[],
  orders: [] as OrderModel[],
  pickedAddress: {} as PickedAddress,
};

const UserReducer = (state: UserState = initialState, action: UserAction) => {
  switch (action.type) {
    case 'ON_UPDATE_LOCATION':
      return {...state, location: action.payload};
    case 'ON_UPDATE_CART':
      const existingItems = state.cart.filter(
        item => item._id === action.payload._id,
      );
      if (existingItems.length) {
        const updatedCart = state.cart.map(food => {
          if (food._id === action.payload._id) {
            food.unit = action.payload.unit;
          }
          return food;
        });
        return {...state, cart: updatedCart.filter(item => item.unit > 0)};
      } else {
        return {...state, cart: [...state.cart, action.payload]};
      }
    case 'USER_LOGIN':
      return {...state, user: action.payload};
    case 'ON_CREATE_ORDER':
      return {...state, cart: [], orders: [...state.orders, action.payload]};
    case 'ON_VIEW_ORDER':
    case 'ON_CANCEL_ORDER':
      return {...state, orders: action.payload};
    case 'ON_USER_LOGOUT':
      return {...state, user: {} as UserModel};
    case 'ON_FETCH_LOCATION':
      return {...state, pickedAddress: action.payload};
    default:
      return state;
  }
};

export {UserReducer};
