import React, { Component } from 'react'
import { Text, StyleSheet } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper'

import Login from './src/screens/Login'
import Order from './src/screens/Order'
import Scanner from './src/screens/Scanner'

const Stack = createStackNavigator()

class App extends Component {
    render() {
        return (
            <PaperProvider theme={theme}>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName='login' headerMode='none'>
                        <Stack.Screen name="login" component={Login} />
                        <Stack.Screen name="order" component={Order} />
                        <Stack.Screen name="scanner" component={Scanner} />
                    </Stack.Navigator>
                </NavigationContainer>
            </PaperProvider>
        )
    }
}

const styles = StyleSheet.create({
    defaultFontFamily: {
        fontFamily: 'lucida grande'
    }
})

const oldRender = Text.render
Text.render = function (...args) {
    const origin = oldRender.call(this, ...args)
    return React.cloneElement(origin, {
        style: [styles.defaultFontFamily, origin.props.style]
    })
}

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#25b7d3',
        accent: '#25b7d3'
    }
}

export default App