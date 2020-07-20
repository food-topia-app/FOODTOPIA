import axios from 'axios'

import setAuthToken from '../utils/setAuthToken'
import {
	BRANCH_ADD,
	BRANCH_ALERT,
	BRANCH_BLOCK,
	BRANCH_CLEAR_ALERT,
	BRANCH_EDIT,
	BRANCH_LIST,
	BRANCH_LOADING,
	BRANCH_REMOVE,
	BRANCH_UNBLOCK,
	BRANCH_NOTIFY_SUCCESS
} from './types'

export const branchAdd = branchData => async dispatch => {
	if (localStorage.token) {
		setAuthToken(localStorage.token)
	} else {
		return
	}
	const config = {
		headers: {
			'Content-Type': 'application/json'
		}
	}

	try {
		dispatch(setLoading())

		await axios.post(
			'/api/branch',
			{
				location: branchData.location,
				name: branchData.name,
				password: branchData.password,
				phoneNumber: branchData.phoneNumber
			},
			config
		)
		dispatch({
			type: BRANCH_ADD,
			payload: 'Branch added'
		})
	} catch (err) {
		dispatch({
			type: BRANCH_ALERT,
			payload: err.response ? err.response.data.msg : 'Branch not added'
		})
	}
}

export const branchBlock = id => async dispatch => {
	if (localStorage.token) {
		setAuthToken(localStorage.token)
	} else {
		return
	}

	try {
		dispatch(setLoading())

		await axios.put('/api/branch/block/' + id)
		dispatch({
			type: BRANCH_BLOCK,
			payload: 'Branch blocked'
		})
	} catch (err) {
		dispatch({
			type: BRANCH_ALERT,
			payload: err.message
		})
	}
}

export const branchEdit = branchData => async dispatch => {
	if (localStorage.token) {
		setAuthToken(localStorage.token)
	} else {
		return
	}
	const config = {
		headers: {
			'Content-Type': 'application/json'
		}
	}

	try {
		dispatch(setLoading())

		let toSendData = {}

		if (branchData.location !== branchData.initial.location)
			toSendData.location = branchData.location
		if (branchData.name !== branchData.initial.name)
			toSendData.name = branchData.name
		if (branchData.password !== '') toSendData.password = branchData.password
		if (branchData.phoneNumber !== branchData.initial.phoneNumber)
			toSendData.phoneNumber = branchData.phoneNumber

		if (Object.keys(toSendData).length > 0) {
			await axios.put('/api/branch/' + branchData._id, toSendData, config)
			dispatch({
				type: BRANCH_EDIT,
				payload: 'Branch updated'
			})
		} else {
			dispatch({
				type: BRANCH_ALERT,
				payload: 'Nothing to update'
			})
		}
	} catch (err) {
		dispatch({
			type: BRANCH_ALERT,
			payload: err.response ? err.response.data.msg : 'Branch not updated'
		})
	}
}

export const branchList = () => async dispatch => {
	if (localStorage.token) {
		setAuthToken(localStorage.token)
	} else {
		return
	}

	try {
		dispatch(setLoading())

		const res = await axios.get('/api/branch/list')
		dispatch({
			type: BRANCH_LIST,
			payload: res.data
		})
	} catch (err) {
		dispatch({
			type: BRANCH_ALERT,
			payload: err.message
		})
	}
}

export const branchNotification = (notification) => async dispatch => {

	if (localStorage.token) {
		setAuthToken(localStorage.token)
	} else {
		return
	}

	try {
		dispatch(setLoading())
		await axios.post('/api/branch/notify', notification)
		dispatch({
			type: BRANCH_NOTIFY_SUCCESS,
			payload: "Notification Sent"
		})
	} catch (err) {
		dispatch({
			type: BRANCH_ALERT,
			payload: err.response ? err.response.data.msg : 'Notification Failed!'
		})
	}
}

export const branchRemove = id => async dispatch => {
	if (localStorage.token) {
		setAuthToken(localStorage.token)
	} else {
		return
	}

	try {
		dispatch(setLoading())

		await axios.delete('/api/branch/' + id)
		dispatch({
			type: BRANCH_REMOVE,
			payload: 'Branch removed'
		})
	} catch (err) {
		dispatch({
			type: BRANCH_ALERT,
			payload: err.message
		})
	}
}

export const branchUnblock = id => async dispatch => {
	if (localStorage.token) {
		setAuthToken(localStorage.token)
	} else {
		return
	}

	try {
		dispatch(setLoading())

		await axios.put('/api/branch/unblock/' + id)
		dispatch({
			type: BRANCH_UNBLOCK,
			payload: 'Branch unblocked'
		})
	} catch (err) {
		dispatch({
			type: BRANCH_ALERT,
			payload: err.message
		})
	}
}

export const clearAlert = () => dispatch =>
	dispatch({
		type: BRANCH_CLEAR_ALERT
	})

export const setLoading = () => async dispatch => {
	dispatch({
		type: BRANCH_LOADING
	})
}
