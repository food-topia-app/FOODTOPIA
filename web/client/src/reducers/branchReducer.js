import {
	BRANCH_ADD,
	BRANCH_ALERT,
	BRANCH_BLOCK,
	BRANCH_CLEAR_ALERT,
	BRANCH_EDIT,
	BRANCH_LIST,
	BRANCH_LOADING,
	BRANCH_REMOVE,
	BRANCH_RESET,
	BRANCH_UNBLOCK,
	BRANCH_NOTIFY_SUCCESS
} from '../actions/types'

const initialState = {
	alert: null,
	branches: [],
	loading: false
}

export default (state = initialState, action) => {
	switch (action.type) {
		case BRANCH_ADD:
		case BRANCH_ALERT:
		case BRANCH_BLOCK:
		case BRANCH_EDIT:
		case BRANCH_REMOVE:
		case BRANCH_UNBLOCK:
		case BRANCH_NOTIFY_SUCCESS:
			return {
				...state,
				alert: action.payload,
				loading: false
			}
		case BRANCH_CLEAR_ALERT:
			return {
				...state,
				alert: null
			}
		case BRANCH_LIST:
			return {
				...state,
				branches: action.payload,
				loading: false
			}
		case BRANCH_LOADING:
			return { ...state, loading: true }
		case BRANCH_RESET:
			return { ...initialState }
		default:
			return state
	}
}
