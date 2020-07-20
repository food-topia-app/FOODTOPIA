import axios from 'axios'

import setAuthToken from '../utils/setAuthToken'
import {
	PRODUCT_ADD,
	PRODUCT_ALERT,
	PRODUCT_CLEAR_ALERT,
	PRODUCT_EDIT,
	PRODUCT_LIST,
	PRODUCT_LOADING,
	PRODUCT_REMOVE,
} from './types'

export const productAdd = productData => async dispatch => {
	if (localStorage.token) {
		setAuthToken(localStorage.token)
	} else {
		return
	}
	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	}

	const configPic = {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	}

	try {
		dispatch(setLoading())

		const res = await axios.post(
			'/api/product',
			{
				category: productData.category,
				description: productData.description,
				name: productData.name,
				quantity: productData.quantity,
				rate: productData.rate,
				stock: productData.stock,
				sellerName: productData.sellerName,
				sellerNumber: productData.sellerNumber,
				type: productData.type,
				unit: productData.unit,
			},
			config
		)
		if (productData.pic[0]) {
			const formData = new FormData()
			formData.append('id', res.data)
			formData.append('pic', productData.pic[0])
			await axios.post('/api/product/pic', formData, configPic)
		}
		dispatch({
			type: PRODUCT_ADD,
			payload: 'Product added',
		})
	} catch (err) {
		console.log(err)
		dispatch({
			type: PRODUCT_ALERT,
			payload: err.response ? err.response.data.msg : 'Product not added',
		})
	}
}

export const productEdit = productData => async dispatch => {
	if (localStorage.token) {
		setAuthToken(localStorage.token)
	} else {
		return
	}
	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	}

	const configPic = {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	}

	try {
		dispatch(setLoading())

		let toSendData = {}

		if (productData.category !== productData.initial.category)
			toSendData.category = productData.category
		if (productData.description !== productData.initial.description)
			toSendData.description = productData.description
		if (productData.name !== productData.initial.name)
			toSendData.name = productData.name
		if (productData.quantity !== productData.initial.quantity)
			toSendData.quantity = productData.quantity
		if (productData.rate !== productData.initial.rate)
			toSendData.rate = productData.rate
		if (productData.stock !== productData.initial.stock)
			toSendData.stock = productData.stock
		if (productData.sellerName !== productData.initial.sellerName)
			toSendData.sellerName = productData.sellerName
		if (productData.sellerNumber !== productData.initial.sellerNumber)
			toSendData.sellerNumber = productData.sellerNumber
		if (productData.type === !productData.initial.type)
			toSendData.type = productData.type
		if (productData.unit !== productData.initial.unit)
			toSendData.unit = productData.unit

		if (productData.pic) {
			const formData = new FormData()
			formData.append('id', productData._id)
			formData.append('pic', productData.pic[0])
			await axios.post('/api/product/pic', formData, configPic)
			dispatch({
				type: PRODUCT_EDIT,
				payload: 'Product picture updated',
			})
		}

		if (Object.keys(toSendData).length > 0) {
			await axios.put('/api/product/' + productData._id, toSendData, config)
			dispatch({
				type: PRODUCT_EDIT,
				payload: 'Product updated',
			})
		}

		if (!(productData.pic[0] || Object.keys(toSendData).length > 0)) {
			dispatch({
				type: PRODUCT_ALERT,
				payload: 'Nothing to update',
			})
		}
	} catch (err) {
		console.log(err)
		dispatch({
			type: PRODUCT_ALERT,
			payload: err.response ? err.response.data.msg : 'Product not updated',
		})
	}
}

export const productList = () => async dispatch => {
	if (localStorage.token) {
		setAuthToken(localStorage.token)
	} else {
		return
	}

	try {
		dispatch(setLoading())

		const res = await axios.get('/api/product/list')
		dispatch({
			type: PRODUCT_LIST,
			payload: res.data,
		})
	} catch (err) {
		dispatch({
			type: PRODUCT_ALERT,
			payload: err.message,
		})
	}
}

export const productRemove = id => async dispatch => {
	if (localStorage.token) {
		setAuthToken(localStorage.token)
	} else {
		return
	}

	try {
		dispatch(setLoading())

		await axios.delete('/api/product/' + id)
		dispatch({
			type: PRODUCT_REMOVE,
			payload: 'Product removed',
		})
	} catch (err) {
		dispatch({
			type: PRODUCT_ALERT,
			payload: err.message,
		})
	}
}

export const clearAlert = () => dispatch =>
	dispatch({
		type: PRODUCT_CLEAR_ALERT,
	})

export const setLoading = () => async dispatch => {
	dispatch({
		type: PRODUCT_LOADING,
	})
}
