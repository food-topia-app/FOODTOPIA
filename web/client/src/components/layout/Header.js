import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

const Header = ({ auth: { isAuth, username, id } }) => {
	let links = []
	if (isAuth) {
		if (username === 'admin')
			links = [
				{
					link: '/branches',
					title: 'Branches'
				},
				{
					link: '/orders',
					title: 'Orders'
				}
			]
		else
			links = [
				{
					link: '/branch/edit/' + id,
					title: 'Settings'
				},
				{
					link: '/orders',
					title: 'Orders'
				},
				{
					link: '/branch/notification',
					title: 'Send Notification'
				},
				{
					link: '/products',
					title: 'Products'
				}
			]
		links.push({
			link: '/logout',
			title: 'Logout'
		})
	} else {
		links = []
	}
	return (
		<>
			<header className='mdl-layout__header mdl-layout__header--scroll'>
				<div className='mdl-layout__header-row'>
					<span className='mdl-layout-title'>Foodtopia Admin Portal</span>
					<div className='mdl-layout-spacer'></div>
					<nav className='mdl-navigation'>
						{links.map((a, key) => (
							<Link key={key} className='mdl-navigation__link' to={a.link}>
								{a.title}
							</Link>
						))}
					</nav>
				</div>
			</header>
			<div className='mdl-layout__drawer'>
				<nav className='mdl-navigation'>
					{links.map((a, key) => (
						<Link key={key} className='mdl-navigation__link' to={a.link}>
							{a.title}
						</Link>
					))}
				</nav>
			</div>
		</>
	)
}

const mapStateToProps = state => ({
	auth: state.auth
})

Header.propTypes = {
	auth: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(Header)
