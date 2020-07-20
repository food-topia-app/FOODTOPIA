import {ORDER_HISTORY_RESET} from './types'

export const resetOrderHistory = (reset) => {
    return {
        type: ORDER_HISTORY_RESET,
        payload: reset
    }
} 