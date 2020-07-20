import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { alertShow } from '../../actions/alertActions'
import { clearError, getUser, loginUser } from '../../actions/authActions'

const Login = ({
	alertShow,
	auth: { error, isAuth, loading, username },
	clearError,
	getUser,
	history,
	loginUser
}) => {
	useEffect(() => {
		if (isAuth && !loading) {
			username === 'admin' ? history.push('/branches') : history.push('/orders')
		}
		if (error) {
			alertShow(error)
			clearError()
		}
		getUser()
		// eslint-disable-next-line
	}, [isAuth, loading])

	const [user, setUser] = useState({
		password: '',
		passwordLabel: '',
		username: '',
		usernameLabel: '',
		valid: true
	})

	const formSubmitHandler = event => {
		event.preventDefault()
		loginUser(user)
	}

	const passwordInputHandler = ({ target: { value } }) => {
		setUser({
			...user,
			password: value.match(/^[0-9a-zA-Z]*$/) ? value : user.password,
			passwordLabel: !value.match(/^[0-9a-zA-Z]*$/)
				? ' (only alphabets and numbers are allowed)'
				: value === ''
				? ' (cannnot be empty)'
				: '',
			valid: !value.match(/^[0-9a-zA-Z]+/) || user.username === ''
		})
	}

	const userInputHandler = ({ target: { value } }) => {
		setUser({
			...user,
			username: value.match(/^[0-9a-zA-Z]*$/) ? value : user.username,
			usernameLabel: !value.match(/^[0-9a-zA-Z]*$/)
				? ' (only alphabets and numbers are allowed)'
				: value === ''
				? ' (cannnot be empty)'
				: '',
			valid: !value.match(/^[0-9a-zA-Z]+/) || user.password === ''
		})
	}

	return (
		<div>
			<form onSubmit={formSubmitHandler}>
				<div className='mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-half-focused'>
					<input
						autoFocus
						className='mdl-textfield__input'
						type='text'
						name='username'
						value={user.username}
						onChange={userInputHandler}
					/>
					<label className='mdl-textfield__label' htmlFor='username'>
						{'Username' + user.usernameLabel}
					</label>
				</div>
				<br />
				<div className='mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-half-focused'>
					<input
						className='mdl-textfield__input'
						type='password'
						name='password'
						value={user.password}
						onChange={passwordInputHandler}
					/>
					<label className='mdl-textfield__label' htmlFor='password'>
						{'Password' + user.passwordLabel}
					</label>
				</div>
				<br />
				<input
					className='mdl-button mdl-js-button mdl-button--raised mdl-button--colored'
					type='submit'
					value='Login'
					disabled={user.valid}
				/>
			</form>
		</div>
	)
}

const mapStateToProps = state => ({
	auth: state.auth
})

Login.propTypes = {
	alertShow: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	getUser: PropTypes.func.isRequired,
	history: PropTypes.object.isRequired,
	loginUser: PropTypes.func.isRequired
}

export default connect(mapStateToProps, {
	alertShow,
	clearError,
	getUser,
	loginUser
})(Login)
