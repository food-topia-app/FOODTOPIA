import {
	PRODUCT_ADD,
	PRODUCT_ALERT,
	PRODUCT_CLEAR_ALERT,
	PRODUCT_EDIT,
	PRODUCT_LIST,
	PRODUCT_LOADING,
	PRODUCT_REMOVE,
	PRODUCT_RESET
} from '../actions/types'

const initialState = {
	alert: null,
	loading: false,
	products: [],
	services: []
}

export default (state = initialState, action) => {
	switch (action.type) {
		case PRODUCT_ADD:
		case PRODUCT_ALERT:
		case PRODUCT_EDIT:
		case PRODUCT_REMOVE:
			return {
				...state,
				alert: action.payload,
				loading: false
			}
		case PRODUCT_CLEAR_ALERT:
			return {
				...state,
				alert: null
			}
		case PRODUCT_LIST:
			return {
				...state,
				products: action.payload.filter(p => p.type),
				services: action.payload.filter(p => !p.type),
				loading: false
			}
		case PRODUCT_LOADING:
			return { ...state, loading: true }
		case PRODUCT_RESET:
			return { ...initialState }
		default:
			return state
	}
}
