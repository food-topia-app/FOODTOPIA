import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'

import { alertShow } from '../../actions/alertActions'
import {
	branchBlock,
	branchUnblock,
	clearAlert
} from '../../actions/branchActions'

const ListItem = ({
	alertShow,
	branch: { alert },
	branchBlock,
	branchUnblock,
	clearAlert,
	branchInfo
}) => {
	useEffect(() => {
		if (alert && blocked.init) {
			alert === 'Branch blocked' || alert === 'Branch unblocked'
				? alertShow(alert, 'success')
				: alertShow(alert)
			clearAlert()
			if (alert === 'Branch blocked') {
				setBlocked({
					init: false,
					value: true
				})
			} else if (alert === 'Branch unblocked') {
				setBlocked({
					init: false,
					value: false
				})
			}
		}
		// eslint-disable-next-line
	}, [alert])

	const [blocked, setBlocked] = useState({
		init: false,
		value: branchInfo.blocked
	})

	const initBranchBlock = () => {
		setBlocked({
			...blocked,
			init: true
		})
		branchBlock(branchInfo._id)
	}

	const initBranchUnblock = () => {
		setBlocked({
			...blocked,
			init: true
		})
		branchUnblock(branchInfo._id)
	}

	return (
		<div className='branch mdl-card mdl-shadow--2dp'>
			<div className='mdl-card__title'>
				<h2 className='mdl-card__title-text'>{branchInfo.name}</h2>
			</div>
			<div className='mdl-card__supporting-text'>
				<p>{branchInfo.location}<br/>{branchInfo.phoneNumber}</p>
			</div>
			<div className='mdl-card__actions mdl-card--border'>
				<Link
					to={'/branch/edit/' + branchInfo._id}
					className='mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect'
				>
					Edit
				</Link>
				<button
					onClick={blocked.value ? initBranchUnblock : initBranchBlock}
					className='mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect'
				>
					{blocked.value ? 'Unblock' : 'Block'}
				</button>
				<Link
					to={'/branch/remove/' + branchInfo._id}
					className='mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect'
				>
					Remove
				</Link>
			</div>
		</div>
	)
}

const mapStateToProps = state => ({
	branch: state.branch
})

ListItem.propTypes = {
	alertShow: PropTypes.func.isRequired,
	branch: PropTypes.object.isRequired,
	branchBlock: PropTypes.func.isRequired,
	branchUnblock: PropTypes.func.isRequired,
	clearAlert: PropTypes.func.isRequired,
	branchInfo: PropTypes.object.isRequired
}

export default withRouter(
	connect(mapStateToProps, {
		alertShow,
		branchBlock,
		branchUnblock,
		clearAlert
	})(ListItem)
)
