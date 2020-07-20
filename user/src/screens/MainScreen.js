import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { connect } from 'react-redux'

import ProfileScreen from './ProfileScreen';
import ProductServiceScreen from './ProductServiceScreen';
import CartScreen from './CartScreen';
import OrderHistoryScreen from './OrderHistoryScreen';
import { changeScreen } from '../actions/settingsActions'

import HomeIcon from '../icons/home.png'
import CartIcon from '../icons/cart.png'
import HistoryIcon from '../icons/history.png'
import ProfileIcon from '../icons/profile.png'

const components = {
    home: ProductServiceScreen,
    cart: CartScreen,
    orderHistory: OrderHistoryScreen,
    profile: ProfileScreen
}

class MainScreen extends Component {

    state = {
        homeValue: new Animated.Value(1),
        cartValue: new Animated.Value(0),
        orderHistoryValue: new Animated.Value(0),
        profileValue: new Animated.Value(0)
    }

    componentDidUpdate(prevProps) {
        const { mainScreen } = this.props
        if (prevProps.mainScreen !== mainScreen) {
            this.openNavElement(mainScreen)
            this.closeNavElement(prevProps.mainScreen)
        }
    }

    render() {
        const Component = components[this.props.mainScreen]
        return (
            <View style={styles.container}>
                <View style={styles.contents}>
                    <Component
                        navigation={this.props.navigation}
                        cartPressed={this.cartPressed}
                    />
                </View>
                <View style={styles.bottomBar}>
                    <TouchableOpacity onPress={this.homePressed}>
                        <Animated.View
                            style={[styles.bottomBarElement, {
                                backgroundColor: this.state.homeValue.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['#ffffff', '#eeeeee']
                                })
                            }]}>
                            <Image
                                style={styles.bottomBarIconStyle}
                                source={HomeIcon}
                            />
                            <Animated.Text
                                style={[styles.bottomBarText, {
                                    width: this.state.homeValue.interpolate({
                                        inputRange: [0, 1], outputRange: [0, 40]
                                    }),
                                    marginLeft: this.state.homeValue.interpolate({
                                        inputRange: [0, 1], outputRange: [0, 5]
                                    })
                                }]}
                            >Home
                            </Animated.Text>
                        </Animated.View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.cartPressed}>
                        <Animated.View
                            style={[styles.bottomBarElement, {
                                backgroundColor: this.state.cartValue.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['#ffffff', '#eeeeee']
                                })
                            }]}>
                            <Image
                                style={styles.bottomBarIconStyle}
                                source={CartIcon}
                            />
                            <Animated.Text
                                style={[styles.bottomBarText, {
                                    width: this.state.cartValue.interpolate({
                                        inputRange: [0, 1], outputRange: [0, 28]
                                    }),
                                    marginLeft: this.state.cartValue.interpolate({
                                        inputRange: [0, 1], outputRange: [0, 5]
                                    })
                                }]}
                            >Cart
                            </Animated.Text>
                        </Animated.View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.orderHistoryPressed}>
                        <Animated.View
                            style={[styles.bottomBarElement, {
                                backgroundColor: this.state.orderHistoryValue.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['#ffffff', '#eeeeee']
                                })
                            }]}>
                            <Image
                                style={styles.bottomBarIconStyle}
                                source={HistoryIcon}
                            />
                            <Animated.Text
                                style={[styles.bottomBarText, {
                                    width: this.state.orderHistoryValue.interpolate({
                                        inputRange: [0, 1], outputRange: [0, 35]
                                    }),
                                    marginLeft: this.state.orderHistoryValue.interpolate({
                                        inputRange: [0, 1], outputRange: [0, 5]
                                    })
                                }]}
                            >Orders
                            </Animated.Text>
                        </Animated.View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.profilePressed}>
                        <Animated.View
                            style={[styles.bottomBarElement, {
                                backgroundColor: this.state.profileValue.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['#ffffff', '#eeeeee']
                                })
                            }]}>
                            <Image
                                style={styles.bottomBarIconStyle}
                                source={ProfileIcon}
                            />
                            <Animated.Text
                                style={[styles.bottomBarText, {
                                    width: this.state.profileValue.interpolate({
                                        inputRange: [0, 1], outputRange: [0, 43]
                                    }),
                                    marginLeft: this.state.profileValue.interpolate({
                                        inputRange: [0, 1], outputRange: [0, 5]
                                    })
                                }]}
                            >Profile
                            </Animated.Text>
                        </Animated.View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    homePressed = () => {
        if (this.state.currentScreen !== 'home')
            this.props.changeScreen('home')
    }

    cartPressed = () => {
        if (this.state.currentScreen !== 'cart')
            this.props.changeScreen('cart')

    }

    orderHistoryPressed = () => {
        if (this.state.currentScreen !== 'orderHistory')
            this.props.changeScreen('orderHistory')
    }

    profilePressed = () => {
        if (this.state.currentScreen !== 'profile')
            this.props.changeScreen('profile')
    }

    openNavElement = (screenName) => {
        Animated.timing(this.state[screenName + 'Value'], {
            toValue: 1,
            duration: 200
        }).start()
    }

    closeNavElement = (screenName) => {
        Animated.timing(this.state[screenName + 'Value'], {
            toValue: 0,
            duration: 200
        }).start()
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    contents: {
        width: '100%',
        flex: 10,
    },
    bottomBar: {
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: 'white'
    },
    bottomBarIconStyle: {
        width: 20,
        height: 20
    },
    bottomBarText: {
        color: '#757575',
        height: 20
    },
    bottomBarElement: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        padding: 10
    }
})

const mapStateToProps = state => ({
    mainScreen: state.settings.mainScreen
})

const mapDispatchToProps = dispatch => ({
    changeScreen: (screen) => dispatch(changeScreen(screen))
})

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen)