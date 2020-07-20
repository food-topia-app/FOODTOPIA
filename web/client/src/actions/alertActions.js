import { ALERT_REMOVE, ALERT_SHOW } from './types'

export const alertShow = (error, type = '') => dispatch => {
	dispatch({
		type: ALERT_SHOW,
		payload: { msg: error, type }
	})
	setTimeout(() => {
		dispatch({
			type: ALERT_REMOVE,
			payload: error
		})
	}, 5000)
}
