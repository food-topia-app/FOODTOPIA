import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const Loading = ({
	auth: { loading: authLoading },
	branch: { loading: branchLoading },
	order: { loading: orderLoading },
	product: { loading: productLoading }
}) => {
	if (authLoading || branchLoading || orderLoading || productLoading) {
		return (
			<div id='spinner'>
				<div className='mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active'></div>
			</div>
		)
	}
	return <></>
}

const mapStateToProps = state => ({
	auth: state.auth,
	branch: state.branch,
	order: state.order,
	product: state.product
})

Loading.propTypes = {
	auth: PropTypes.object.isRequired,
	branch: PropTypes.object.isRequired,
	order: PropTypes.object.isRequired,
	product: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(Loading)
