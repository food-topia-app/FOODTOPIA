import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { alertShow } from '../../actions/alertActions'
import { productRemove, clearAlert } from '../../actions/productActions'

const ProductEdit = ({
	alertShow,
	product: { alert, products, services },
	productRemove,
	clearAlert,
	history,
	match
}) => {
	const [product, setProduct] = useState({
		_id: '',
		initial: '',
		name: '',
		valid: true
	})

	useEffect(() => {
		const pns = products.concat(services)
		const [currentProduct] = pns.filter(a => {
			return a._id === match.params.id
		})
		setProduct({
			...product,
			initial: currentProduct.name,
			_id: currentProduct._id
		})
		if (alert) {
			alert === 'Product removed'
				? alertShow(alert, 'success')
				: alertShow(alert)
			clearAlert()
			if (alert === 'Product removed') {
				setProduct({
					name: '',
					valid: false
				})
				history.push('/products')
			}
		}
		// eslint-disable-next-line
	}, [alert])

	const formSubmitHandler = event => {
		event.preventDefault()
		productRemove(product._id)
	}

	const nameInputHandler = ({ target: { value } }) => {
		setProduct({
			...product,
			// name: value.match(/^[0-9a-zA-Z- ]*$/) ? value : product.name,
			// valid: !value.match(/^[0-9a-zA-Z]+/) || value !== product.initial
			name: value,
			valid: value !== product.initial
		})
	}

	return (
		<div>
			<p>
				To remove the product <b>'{product.initial}'</b> enter the name of the
				product below and click 'Remove'.
			</p>
			<form onSubmit={formSubmitHandler}>
				<div className='mdl-textfield mdl-js-textfield'>
					<input
						autoFocus
						className='mdl-textfield__input'
						type='text'
						name='name'
						value={product.name}
						onChange={nameInputHandler}
						placeholder='Enter product name'
					/>
				</div>
				<br />
				<input
					className='mdl-button mdl-js-button mdl-button--raised mdl-button--colored'
					type='submit'
					value='Remove Product'
					disabled={product.valid}
				/>
			</form>
		</div>
	)
}

const mapStateToProps = state => ({
	product: state.product
})

ProductEdit.propTypes = {
	alertShow: PropTypes.func.isRequired,
	product: PropTypes.object.isRequired,
	productRemove: PropTypes.func.isRequired,
	clearAlert: PropTypes.func.isRequired,
	history: PropTypes.object.isRequired,
	match: PropTypes.object.isRequired
}

export default withRouter(
	connect(mapStateToProps, {
		alertShow,
		productRemove,
		clearAlert
	})(ProductEdit)
)
