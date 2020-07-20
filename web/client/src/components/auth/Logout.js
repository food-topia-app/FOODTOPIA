import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { logoutUser } from '../../actions/authActions'

const Logout = ({ logoutUser }) => {
	useEffect(() => {
		logoutUser()
		// eslint-disable-next-line
	}, [])

	return <>Logging out...</>
}

Logout.propTypes = {
	logoutUser: PropTypes.func.isRequired
}

export default connect(null, { logoutUser })(Logout)
