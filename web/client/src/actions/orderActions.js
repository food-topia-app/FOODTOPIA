import axios from 'axios'

import setAuthToken from '../utils/setAuthToken'
import {
	ORDER_ALERT,
	ORDER_APPROVE,
	ORDER_CANCEL,
	ORDER_CLEAR_ALERT,
	ORDER_DELIVER,
	ORDER_LIST,
	ORDER_LOADING,
	ORDER_PAYMENT
} from './types'

export const clearAlert = () => dispatch =>
	dispatch({
		type: ORDER_CLEAR_ALERT
	})

export const orderApprove = id => async dispatch => {
	if (localStorage.token) {
		setAuthToken(localStorage.token)
	} else {
		return
	}

	try {
		dispatch(setLoading())

		await axios.put('/api/order/approve/' + id)
		dispatch({
			type: ORDER_APPROVE,
			payload: 'Order approved'
		})

		dispatch(orderList())
	} catch (err) {
		dispatch({
			type: ORDER_ALERT,
			payload: err.message
		})
	}
}

export const orderCancel = id => async dispatch => {
	if (localStorage.token) {
		setAuthToken(localStorage.token)
	} else {
		return
	}

	try {
		dispatch(setLoading())

		await axios.put('/api/order/cancel/' + id)
		dispatch({
			type: ORDER_CANCEL,
			payload: 'Order cancelled'
		})

		dispatch(orderList())
	} catch (err) {
		dispatch({
			type: ORDER_ALERT,
			payload: err.message
		})
	}
}

export const orderDeliver = id => async dispatch => {
	if (localStorage.token) {
		setAuthToken(localStorage.token)
	} else {
		return
	}

	try {
		dispatch(setLoading())

		await axios.put('/api/order/deliver/' + id)
		dispatch({
			type: ORDER_DELIVER,
			payload: 'Order delivered'
		})

		dispatch(orderList())
	} catch (err) {
		dispatch({
			type: ORDER_ALERT,
			payload: err.message
		})
	}
}

export const orderList = () => async dispatch => {
	if (localStorage.token) {
		setAuthToken(localStorage.token)
	} else {
		return
	}

	try {
		dispatch(setLoading())

		const res = await axios.get('/api/order/list')
		dispatch({
			type: ORDER_LIST,
			payload: res.data.reverse()
		})
	} catch (err) {
		dispatch({
			type: ORDER_ALERT,
			payload: err.message
		})
	}
}

export const orderPayment = id => async dispatch => {
	if (localStorage.token) {
		setAuthToken(localStorage.token)
	} else {
		return
	}

	try {
		dispatch(setLoading())

		await axios.put('/api/order/payment/' + id)
		dispatch({
			type: ORDER_PAYMENT,
			payload: 'Order payed'
		})

		dispatch(orderList())
	} catch (err) {
		dispatch({
			type: ORDER_ALERT,
			payload: err.message
		})
	}
}

export const setLoading = () => async dispatch => {
	dispatch({
		type: ORDER_LOADING
	})
}
