import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { Redirect, Route, withRouter } from 'react-router-dom'

const PrivateRoute = ({
	auth: { isAuth, loading },
	component: Component,
	path,
	...rest
}) => {
	return (
		<Route
			{...rest}
			render={props =>
				!isAuth && !loading ? <Redirect to='/' /> : <Component {...props} />
			}
		/>
	)
}

const mapStateToProps = state => ({
	auth: state.auth
})

PrivateRoute.propTypes = {
	auth: PropTypes.object.isRequired,
	component: PropTypes.oneOfType([
		PropTypes.func.isRequired,
		PropTypes.object.isRequired
	])
}

export default withRouter(connect(mapStateToProps)(PrivateRoute))
