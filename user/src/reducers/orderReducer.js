import { ORDER_HISTORY_RESET } from '../actions/types'

const initialState = {
    orderReset: false
}

export default (state = initialState, action) => {
    switch (action.type) {
        case ORDER_HISTORY_RESET:
            return {
                ...state,
                orderReset: action.payload
            }
        default: return state
    }
}