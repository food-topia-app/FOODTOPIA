import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const Alert = ({ alerts }) => {
	if (alerts.length > 0) {
		return (
			<>
				{alerts.map(({ msg, type }, key) => (
					<div className={'errorBox ' + type} key={key}>
						<p>{msg}</p>
					</div>
				))}
			</>
		)
	}
	return <></>
}

const mapStateToProps = state => ({
	alerts: state.alert
})

Alert.propTypes = {
	alerts: PropTypes.array.isRequired
}

export default connect(mapStateToProps)(Alert)
