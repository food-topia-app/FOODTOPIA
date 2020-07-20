import { combineReducers } from 'redux'

import alertReducer from './alertReducer'
import authReducer from './authReducer'
import branchReducer from './branchReducer'
import orderReducer from './orderReducer'
import productReducer from './productReducer'

export default combineReducers({
	alert: alertReducer,
	auth: authReducer,
	branch: branchReducer,
	order: orderReducer,
	product: productReducer
})
