import axios from 'axios'

import setAuthToken from '../utils/setAuthToken'
import {
	BRANCH_RESET,
	USER_CLEAR_ERROR,
	USER_ERROR,
	USER_GET,
	USER_LOADING,
	USER_LOGIN,
	USER_LOGOUT
} from './types'

export const clearError = () => dispatch =>
	dispatch({
		type: USER_CLEAR_ERROR
	})

export const getUser = () => async dispatch => {
	if (localStorage.token) {
		setAuthToken(localStorage.token)
	} else {
		return
	}
	try {
		dispatch(setLoading())
		const res = await axios.get('/api/auth')
		dispatch({
			type: USER_GET,
			payload: { ...res.data, token: localStorage.token }
		})
	} catch (err) {
		localStorage.removeItem('token')
		dispatch({
			type: USER_ERROR,
			payload: err.response ? err.response.data.msg : 'Could not verify token'
		})
	}
}

export const loginUser = userData => async dispatch => {
	const config = {
		headers: {
			'Content-Type': 'application/json'
		}
	}

	try {
		dispatch(setLoading())

		const res = await axios.post(
			'/api/auth',
			{ username: userData.username, password: userData.password },
			config
		)
		localStorage.setItem('token', res.data.token)
		dispatch({
			type: USER_LOGIN,
			payload: {
				id: res.data.id,
				token: res.data.token,
				username: userData.username
			}
		})
	} catch (err) {
		localStorage.removeItem('token')
		dispatch({
			type: USER_ERROR,
			payload: err.response ? err.response.data.msg : 'Login failed'
		})
	}
}

export const logoutUser = () => async dispatch => {
	localStorage.removeItem('token')
	dispatch({
		type: USER_LOGOUT
	})
	dispatch({
		type: BRANCH_RESET
	})
}

export const setLoading = () => async dispatch => {
	dispatch({
		type: USER_LOADING
	})
}
