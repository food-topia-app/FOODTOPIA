import { combineReducers } from 'redux'

import productReducer from './productReducer'
import orderReducer from './orderReducer'
import settingsReducer from './settingsReducer'

export default combineReducers({
    product: productReducer,
    order: orderReducer,
    settings: settingsReducer
})