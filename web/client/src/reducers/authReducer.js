import {
	USER_CLEAR_ERROR,
	USER_GET,
	USER_ERROR,
	USER_LOADING,
	USER_LOGIN,
	USER_LOGOUT
} from '../actions/types'

const initialState = {
	error: null,
	id: null,
	isAuth: false,
	loading: false,
	token: null,
	username: null
}

export default (state = initialState, action) => {
	switch (action.type) {
		case USER_CLEAR_ERROR:
			return {
				...state,
				error: null
			}
		case USER_ERROR:
			return {
				...state,
				...initialState,
				error: action.payload
			}
		case USER_GET:
			return {
				...state,
				...action.payload,
				isAuth: true,
				loading: false
			}
		case USER_LOGIN:
			return {
				...state,
				error: null,
				isAuth: true,
				loading: false,
				...action.payload
			}
		case USER_LOGOUT:
			return {
				...initialState
			}
		case USER_LOADING:
			return { ...state, loading: true }
		default:
			return state
	}
}
