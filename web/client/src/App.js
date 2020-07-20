import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'

import Alert from './components/layout/Alert'
import BranchAdd from './components/branch/BranchAdd'
import BranchEdit from './components/branch/BranchEdit'
import BranchRemove from './components/branch/BranchRemove'
import BranchList from './components/branch/BranchList'
import BranchNotification from './components/branch/BranchNotification'
import Footer from './components/layout/Footer'
import Header from './components/layout/Header'
import Loading from './components/layout/Loading'
import Login from './components/auth/Login'
import Logout from './components/auth/Logout'
import OrderList from './components/order/OrderList'
import PrivateRoute from './components/routing/PrivateRoute'
import ProductAdd from './components/product/ProductAdd'
import ProductEdit from './components/product/ProductEdit'
import ProductRemove from './components/product/ProductRemove'
import ProductList from './components/product/ProductList'
import store from './store'
import './App.css'

const App = () => (
	<Provider store={store}>
		<Router>
			<div className='mdl-layout mdl-js-layout'>
				<Header />
				<main className='mdl-layout__content'>
					<div className='page-content'>
						<Alert />
						<Switch>
							<Route exact path='/' component={Login} />
							<PrivateRoute exact path='/branch/add' component={BranchAdd} />
							<PrivateRoute
								exact
								path='/branch/edit/:id'
								component={BranchEdit}
							/>
							<PrivateRoute
								exact
								path='/branch/remove/:id'
								component={BranchRemove}
							/>
							<PrivateRoute exact path='/branches' component={BranchList} />
							<PrivateRoute
								exact
								path='/branch/notification'
								component={BranchNotification}
							/>
							<PrivateRoute exact path='/logout' component={Logout} />
							<PrivateRoute exact path='/orders' component={OrderList} />
							<PrivateRoute exact path='/product/add' component={ProductAdd} />
							<PrivateRoute
								exact
								path='/product/edit/:id'
								component={ProductEdit}
							/>
							<PrivateRoute
								exact
								path='/product/remove/:id'
								component={ProductRemove}
							/>
							<PrivateRoute exact path='/products' component={ProductList} />
						</Switch>
						<Loading />
					</div>
				</main>
				<Footer />
			</div>
		</Router>
	</Provider>
)

export default App
