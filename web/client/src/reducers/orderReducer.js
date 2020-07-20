import {
	ORDER_ALERT,
	ORDER_APPROVE,
	ORDER_CANCEL,
	ORDER_CLEAR_ALERT,
	ORDER_DELIVER,
	ORDER_LIST,
	ORDER_LOADING,
	ORDER_PAYMENT
} from '../actions/types'

const initialState = {
	alert: null,
	orders: [],
	loading: false
}

export default (state = initialState, action) => {
	switch (action.type) {
		case ORDER_ALERT:
		case ORDER_APPROVE:
		case ORDER_CANCEL:
		case ORDER_DELIVER:
		case ORDER_PAYMENT:
			return {
				...state,
				alert: action.payload,
				loading: false
			}
		case ORDER_CLEAR_ALERT:
			return {
				...state,
				alert: null
			}
		case ORDER_LIST:
			return {
				...state,
				orders: action.payload,
				loading: false
			}
		case ORDER_LOADING:
			return { ...state, loading: true }
		default:
			return state
	}
}
