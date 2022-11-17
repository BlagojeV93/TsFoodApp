import {FoodModel} from '../redux';

const checkExistence = (item: FoodModel, cart: FoodModel[]) => {
  if (cart.length) {
    let currentItems = cart.filter(cartItem => cartItem._id === item._id);
    if (currentItems.length > 0) {
      return currentItems[0];
    }
  }

  return item;
};

export {checkExistence};
