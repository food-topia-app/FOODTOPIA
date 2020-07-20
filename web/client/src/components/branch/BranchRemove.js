import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { alertShow } from '../../actions/alertActions'
import { branchRemove, clearAlert } from '../../actions/branchActions'

const BranchEdit = ({
	alertShow,
	branch: { alert, branches },
	branchRemove,
	clearAlert,
	history,
	match
}) => {
	const [branch, setBranch] = useState({
		_id: '',
		initial: '',
		name: '',
		valid: true
	})

	useEffect(() => {
		const [currentBranch] = branches.filter(a => {
			return a._id === match.params.id
		})
		setBranch({
			...branch,
			initial: currentBranch.name,
			_id: currentBranch._id
		})
		if (alert) {
			alert === 'Branch removed'
				? alertShow(alert, 'success')
				: alertShow(alert)
			clearAlert()
			if (alert === 'Branch removed') {
				setBranch({
					name: '',
					valid: false
				})
				history.push('/branches')
			}
		}
		// eslint-disable-next-line
	}, [alert])

	const formSubmitHandler = event => {
		event.preventDefault()
		branchRemove(branch._id)
	}

	const nameInputHandler = ({ target: { value } }) => {
		setBranch({
			...branch,
			name: value.match(/^[0-9a-zA-Z- ]*$/) ? value : branch.name,
			valid: !value.match(/^[0-9a-zA-Z]+/) || value !== branch.initial
		})
	}

	return (
		<div>
			<p>
				To remove the branch <b>'{branch.initial}'</b> enter the name of the
				branch below and click 'Remove'.
			</p>
			<form onSubmit={formSubmitHandler}>
				<div className='mdl-textfield mdl-js-textfield'>
					<input
						autoFocus
						className='mdl-textfield__input'
						type='text'
						name='name'
						value={branch.name}
						onChange={nameInputHandler}
						placeholder='Enter branch name'
					/>
				</div>
				<br />
				<input
					className='mdl-button mdl-js-button mdl-button--raised mdl-button--colored'
					type='submit'
					value='Remove Branch'
					disabled={branch.valid}
				/>
			</form>
		</div>
	)
}

const mapStateToProps = state => ({
	branch: state.branch
})

BranchEdit.propTypes = {
	alertShow: PropTypes.func.isRequired,
	branch: PropTypes.object.isRequired,
	branchRemove: PropTypes.func.isRequired,
	clearAlert: PropTypes.func.isRequired,
	history: PropTypes.object.isRequired,
	match: PropTypes.object.isRequired
}

export default withRouter(
	connect(mapStateToProps, {
		alertShow,
		branchRemove,
		clearAlert
	})(BranchEdit)
)
