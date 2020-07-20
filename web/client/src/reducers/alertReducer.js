import { ALERT_REMOVE, ALERT_SHOW } from '../actions/types'

const initialState = []

export default (state = initialState, action) => {
	switch (action.type) {
		case ALERT_SHOW:
			return [...state, action.payload]
		case ALERT_REMOVE:
			return state.filter(alert => alert.msg !== action.payload)
		default:
			return state
	}
}
