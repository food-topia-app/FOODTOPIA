import { ADD_LOADED_PRODUCTS, CLEAR_PRODUCTS, REMOVE_PRODUCT, UPDATE_PRODUCTS } from './types'

export const removeProduct = (item) => {
    return {
        type: REMOVE_PRODUCT,
        payload: { item }
    }
}

export const clearProducts = () => {
    return {
        type: CLEAR_PRODUCTS
    }
}

export const updateProduct = (item, count) => {
    return {
        type: UPDATE_PRODUCTS,
        payload: { item, count }
    }
}

export const addLoadedProducts = (loadedProducts) => {
    return {
        type: ADD_LOADED_PRODUCTS,
        payload: { loadedProducts }
    }
}