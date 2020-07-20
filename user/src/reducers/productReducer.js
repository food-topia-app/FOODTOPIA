import {
    ADD_LOADED_PRODUCTS, CLEAR_PRODUCTS, REMOVE_PRODUCT, UPDATE_PRODUCTS
} from '../actions/types'

const initialState = {
    products: [],
    loadedProducts: [],
}

export default (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_PRODUCTS:
            let tmpProducts = [...state.products]
            let found = false
            for (let i = 0; i < tmpProducts.length; i++) {
                if (tmpProducts[i].item._id === action.payload.item._id) {
                    tmpProducts.splice(i, 1, action.payload)
                    found = true
                    break;
                }
            }
            if (!found)
                tmpProducts.push(action.payload)
            return {
                ...state,
                products: tmpProducts
            }
        case CLEAR_PRODUCTS:
            state.products = [];
            return state;
        case REMOVE_PRODUCT:
            for (let i = 0; i < state.products.length; i++) {
                if (state.products[i].item._id === action.payload.item._id) {
                    state.products.splice(i, 1);
                    break;
                }
            }
            return state;
        case ADD_LOADED_PRODUCTS:
            state.loadedProducts.push(action.payload.loadedProducts);
            return state;
        default:
            return state;
    }
}