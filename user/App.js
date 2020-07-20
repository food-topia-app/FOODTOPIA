import React, { Component } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { Provider } from 'react-redux'
import { StyleSheet, Text, } from 'react-native'

import configureStore from './src/utils/store'

import LoginScreen from './src/screens/LoginScreen'
import LocationScreen from './src/screens/LocationScreen'
import AboutScreen from './src/screens/AboutScreen'
import MainScreen from './src/screens/MainScreen'
import ProductScreen from './src/screens/ProductScreen'
import CheckoutScreen from './src/screens/CheckoutScreen'
import OneTimeProfileScreen from './src/screens/OneTimeProfileScreen'
import ProductSearchScreen from './src/screens/ProductSearchScreen'
import OrderScreen from './src/screens/OrderScreen'
import QRCodeScreen from './src/screens/QRCodeScreen'

const store = configureStore();
const Stack = createStackNavigator();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='loginScreen' headerMode='none'>
            <Stack.Screen name='mainScreen' component={MainScreen} />
            <Stack.Screen name='loginScreen' component={LoginScreen} />
            <Stack.Screen name='locationScreen' component={LocationScreen} />
            <Stack.Screen name='aboutScreen' component={AboutScreen} />
            <Stack.Screen name='productScreen' component={ProductScreen} />
            <Stack.Screen name='checkoutScreen' component={CheckoutScreen} />
            <Stack.Screen name='oneTimeProfileScreen' component={OneTimeProfileScreen} />
            <Stack.Screen name='productSearchScreen' component={ProductSearchScreen}/>
            <Stack.Screen name='orderScreen' component={OrderScreen}/>
            <Stack.Screen name='qRCodeScreen' component={QRCodeScreen}/>
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  defaultFontFamily: {
    fontFamily: 'lucida grande'
  }
});

const oldRender = Text.render;
Text.render = function (...args) {
  const origin = oldRender.call(this, ...args);
  return React.cloneElement(origin, {
    style: [styles.defaultFontFamily, origin.props.style]
  });
};

export default App;