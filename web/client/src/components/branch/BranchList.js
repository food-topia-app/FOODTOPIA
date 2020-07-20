import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import ListItem from './ListItem'
import { branchList } from '../../actions/branchActions'

const BranchList = ({ branch: { branches }, branchList }) => {
	useEffect(() => {
		branchList()
		// eslint-disable-next-line
	}, [])

	return (
		<>
			<div id='branchList'>
				{branches.length < 1 ? (
					<h3>No branches to show</h3>
				) : (
					branches.map((branch, key) => (
						<ListItem key={key} branchInfo={branch} />
					))
				)}
			</div>
			<div>
				<Link to='/branch/add'>
					<button className='mdl-button mdl-js-button mdl-button--raised mdl-button--colored'>
						Add Branch
					</button>
				</Link>
			</div>
		</>
	)
}

const mapStateToProps = state => ({
	branch: state.branch
})

BranchList.propTypes = {
	branch: PropTypes.object.isRequired,
	branchList: PropTypes.func.isRequired
}

export default connect(mapStateToProps, { branchList })(BranchList)
