import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import { alertShow } from '../../actions/alertActions'
import { branchNotification, clearAlert } from '../../actions/branchActions'

const BranchNotification = ({
	alertShow,
	branch: { alert },
	branchNotification,
	clearAlert,
	history
}) => {
	useEffect(() => {
		if (alert) {
			alert === 'Notification Sent'
				? alertShow(alert, 'success')
				: alertShow(alert)
			if (alert === 'Notification Sent') {
				setNotification(initialNotification)
				history.push('/')
			}
			clearAlert()
		}
		// eslint-disable-next-line
	}, [alert])

	const initialNotification = {
		message: '',
		title: '',
		phoneNumber: ''
	}

	const [notification, setNotification] = useState(initialNotification)

	const formSubmitHandler = event => {
		event.preventDefault()
		branchNotification(notification)
	}

	const inputHandlerTitle = ({ target: { value } }) => {
		setNotification({ ...notification, title: value })
	}

	const inputHandlerMessage = ({ target: { value } }) => {
		setNotification({ ...notification, message: value })
	}

	const inputHandlerPhoneNumber = ({ target: { value } }) => {
		setNotification({ ...notification, phoneNumber: value })
	}

	return (
		<div>
			<form onSubmit={formSubmitHandler}>
				<div className='mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-half-focused'>
					<input
						autoFocus
						className='mdl-textfield__input'
						type='text'
						name='title'
						value={notification.title}
						onChange={inputHandlerTitle}
					/>
					<label className='mdl-textfield__label' htmlFor='name'>
						Notification Title
					</label>
				</div>
				<br />
				<div className='mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-half-focused'>
					<input
						className='mdl-textfield__input'
						type='text'
						name='message'
						value={notification.message}
						onChange={inputHandlerMessage}
					/>
					<label className='mdl-textfield__label' htmlFor='location'>
						Notification Message
					</label>
				</div>
				<br />
				<div className='mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-half-focused'>
					<input
						className='mdl-textfield__input'
						type='text'
						name='phoneNumber'
						value={notification.phoneNumber}
						onChange={inputHandlerPhoneNumber}
					/>
					<label className='mdl-textfield__label' htmlFor='location'>
						Phone Number
					</label>
				</div>
				<br />
				<input
					className='mdl-button mdl-js-button mdl-button--raised mdl-button--colored'
					type='submit'
					value='Send Notification'
				/>
			</form>
		</div>
	)
}

const mapStateToProps = state => ({
	branch: state.branch
})

BranchNotification.propTypes = {
	alertShow: PropTypes.func.isRequired,
	branch: PropTypes.object.isRequired,
	branchNotification: PropTypes.func.isRequired,
	clearAlert: PropTypes.func.isRequired
}

export default connect(mapStateToProps, {
	alertShow,
	branchNotification,
	clearAlert
})(BranchNotification)
