import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { alertShow } from '../../actions/alertActions'
import { branchAdd, clearAlert } from '../../actions/branchActions'

const BranchAdd = ({
	alertShow,
	branch: { alert },
	branchAdd,
	clearAlert,
	history
}) => {
	useEffect(() => {
		if (alert) {
			alert === 'Branch added' ? alertShow(alert, 'success') : alertShow(alert)
			clearAlert()
			if (alert === 'Branch added') {
				setBranch({
					location: '',
					locationLabel: '',
					name: '',
					nameLabel: '',
					password: '',
					passwordLabel: '',
					valid: true,
					phoneNumber: '',
					phoneNumberLabel: ''
				})
				history.push('/branches')
			}
		}
		// eslint-disable-next-line
	}, [alert])

	const [branch, setBranch] = useState({
		location: '',
		locationLabel: '',
		name: '',
		nameLabel: '',
		password: '',
		passwordLabel: '',
		phoneNumber: '',
		phoneNumberLabel: '',
		valid: true
	})

	const formSubmitHandler = event => {
		event.preventDefault()
		branchAdd(branch)
	}

	const locationInputHandler = ({ target: { value } }) => {
		setBranch({
			...branch,
			location: value.match(/^[0-9a-zA-Z-, ]*$/) ? value : branch.location,
			locationLabel: !value.match(/^[0-9a-zA-Z-, ]*$/)
				? ' (only alphabets and numbers are allowed)'
				: value === ''
				? ' (cannnot be empty)'
				: '',
			valid:
				!value.match(/^[0-9a-zA-Z]+/) ||
				branch.name === '' ||
				branch.password === '' ||
				branch.phoneNumber === ''
		})
	}

	const nameInputHandler = ({ target: { value } }) => {
		setBranch({
			...branch,
			name: value.match(/^[0-9a-zA-Z- ]*$/) ? value : branch.name,
			nameLabel: !value.match(/^[0-9a-zA-Z- ]*$/)
				? ' (only alphabets and numbers are allowed)'
				: value === ''
				? ' (cannnot be empty)'
				: '',
			valid:
				!value.match(/^[0-9a-zA-Z]+/) ||
				branch.location === '' ||
				branch.password === '' ||
				branch.phoneNumber === ''
		})
	}

	const passwordInputHandler = ({ target: { value } }) => {
		setBranch({
			...branch,
			password: value.match(/^[0-9a-zA-Z]*$/) ? value : branch.password,
			passwordLabel: !value.match(/^[0-9a-zA-Z]*$/)
				? ' (only alphabets and numbers are allowed)'
				: value === ''
				? ' (cannnot be empty)'
				: '',
			valid:
				!value.match(/^[0-9a-zA-Z]+/) ||
				branch.location === '' ||
				branch.name === '' ||
				branch.phoneNumber === ''
		})
	}

	const phoneNumberInputHandler = ({ target: { value } }) => {
		setBranch({
			...branch,
			phoneNumber: value.match(/^[0-9]*$/) ? value : branch.phoneNumber,
			phoneNumberLabel: !value.match(/^[0-9]*$/)
				? ' (only numbers are allowed)'
				: value === ''
				? ' (cannnot be empty)'
				: '',
			valid:
				!value.match(/^[0-9]+/) ||
				branch.location === '' ||
				branch.name === '' ||
				branch.password === ''
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
						name='name'
						value={branch.name}
						onChange={nameInputHandler}
					/>
					<label className='mdl-textfield__label' htmlFor='name'>
						{'Name' + branch.nameLabel}
					</label>
				</div>
				<br />
				<div className='mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-half-focused'>
					<input
						className='mdl-textfield__input'
						type='text'
						name='location'
						value={branch.location}
						onChange={locationInputHandler}
					/>
					<label className='mdl-textfield__label' htmlFor='location'>
						{'Location' + branch.locationLabel}
					</label>
				</div>
				<br />
				<div className='mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-half-focused'>
					<input
						className='mdl-textfield__input'
						type='password'
						name='password'
						value={branch.password}
						onChange={passwordInputHandler}
					/>
					<label className='mdl-textfield__label' htmlFor='password'>
						{'Password' + branch.passwordLabel}
					</label>
				</div>
				<br />
				<div className='mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-half-focused'>
					<input
						className='mdl-textfield__input'
						type='text'
						name='phoneNumber'
						value={branch.phoneNumber}
						onChange={phoneNumberInputHandler}
					/>
					<label className='mdl-textfield__label' htmlFor='phoneNumber'>
						{'Admin Phone Number' + branch.phoneNumberLabel}
					</label>
				</div>
				<br />
				<input
					className='mdl-button mdl-js-button mdl-button--raised mdl-button--colored'
					type='submit'
					value='Add Branch'
					disabled={branch.valid}
				/>
			</form>
		</div>
	)
}

const mapStateToProps = state => ({
	branch: state.branch
})

BranchAdd.propTypes = {
	alertShow: PropTypes.func.isRequired,
	branch: PropTypes.object.isRequired,
	branchAdd: PropTypes.func.isRequired,
	clearAlert: PropTypes.func.isRequired,
	history: PropTypes.object.isRequired
}

export default connect(mapStateToProps, {
	alertShow,
	clearAlert,
	branchAdd
})(BranchAdd)
