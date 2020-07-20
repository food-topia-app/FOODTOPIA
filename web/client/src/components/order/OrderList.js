import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ListItem from './ListItem'
import { orderList } from '../../actions/orderActions'

const OrderList = ({ order: { orders }, orderList }) => {
	useEffect(() => {
		orderList()
		// eslint-disable-next-line
	}, [])

	return (
		<div id='orderList'>
			{orders.length < 1 ? (
				<h3>No orders to show</h3>
			) : (
				orders.map((order, key) => <ListItem key={key} orderInfo={order} />)
			)}
		</div>
	)
}

const mapStateToProps = state => ({
	order: state.order,
})

OrderList.propTypes = {
	order: PropTypes.object.isRequired,
	orderList: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, { orderList })(OrderList)
