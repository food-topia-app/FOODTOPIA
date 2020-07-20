import React, { Component } from 'react'
import {
    Image, Text, ScrollView, Modal, View, TouchableNativeFeedback
} from 'react-native'
import { TextInput, HelperText, ActivityIndicator } from 'react-native-paper'
import AsyncStorage from '@react-native-community/async-storage'
import { CommonActions } from '@react-navigation/native'

import BigButton from '../components/BigButton'
import Logo from '../icons/logo.png'
import { fetchJSON } from '../utils/Common'

class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            usernameError: false,
            passwordError: false,
            loading: true,
            dialogVisible: false,
            errorMsg: undefined,
            dontShowLogin: true
        }
    }

    componentDidMount() {
        this.checkLoginStatus()
    }

    render() {
        return (
            <>
                {
                    this.state.dontShowLogin ? (
                        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                            <Text>Foodtopia Delivery App</Text>
                        </View>
                    ) : (
                            <ScrollView
                                style={{
                                    flex: 1, backgroundColor: 'white',
                                    opacity: this.state.dialogVisible ? 0.3 : 1.0
                                }}
                                contentContainerStyle={{ padding: 20 }}
                                keyboardShouldPersistTaps='handled'
                            >
                                <Text
                                    style={{
                                        alignSelf: 'center', fontSize: 20, color: '#25b7d3',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Foodtopia
                                </Text>
                                <Image
                                    source={Logo}
                                    resizeMode='contain'
                                    style={{ alignSelf: 'center', height: 150, marginTop: 20 }}
                                />
                                <TextInput
                                    mode='outlined'
                                    label='Username'
                                    autoFocus={true}
                                    defaultValue={this.state.username}
                                    onChangeText={text => this.setState({ username: text })}
                                    style={{ marginTop: 40 }}
                                />
                                <HelperText
                                    type='error'
                                    visible={this.state.usernameError}
                                >
                                    Username cannot be empty!
                                </HelperText>
                                <TextInput
                                    mode='outlined'
                                    label='Password'
                                    defaultValue={this.state.password}
                                    onChangeText={text => this.setState({ password: text })}
                                    secureTextEntry={true}
                                    style={{ marginTop: 20 }}
                                />
                                <HelperText
                                    type='error'
                                    visible={this.state.passwordError}
                                >
                                    Password cannot be empty!
                                </HelperText>
                                <BigButton
                                    text='Login'
                                    onPress={this.login}
                                    style={{ alignSelf: 'center', marginTop: 20 }}
                                />
                            </ScrollView>)
                }
                <Modal
                    visible={this.state.dialogVisible}
                    transparent={true}
                    animationType='fade'
                >
                    <View
                        style={{
                            alignItems: 'center', justifyContent: 'center', flex: 1
                        }}
                    >
                        {
                            this.state.loading ? (
                                <View
                                    style={{
                                        elevation: 10, borderRadius: 50,
                                        backgroundColor: 'white', padding: 5
                                    }}
                                >
                                    <ActivityIndicator animating={true} size='large' />
                                </View>
                            ) : (
                                    <TouchableNativeFeedback
                                        onPress={() => {
                                            this.setState({
                                                loading: true, dialogVisible: false
                                            })
                                        }}
                                    >
                                        <View
                                            style={{
                                                elevation: 2, borderRadius: 5, backgroundColor: 'white',
                                                alignItems: 'center', justifyContent: 'center',
                                                width: '70%', height: 150, pading: 20
                                            }}
                                        >
                                            <Text style={{ textAlign: 'center' }}>
                                                {
                                                    this.state.errorMsg ? this.state.errorMsg :
                                                        'Network Error. Check internet connection '
                                                        + 'and try again.'
                                                }
                                            </Text>
                                            <Text style={{ color: 'grey', marginTop: 10 }}>
                                                (Click to dismiss)
                                            </Text>
                                        </View>
                                    </TouchableNativeFeedback>
                                )
                        }
                    </View>
                </Modal>
            </>
        )
    }

    login = async () => {
        const { username, password } = this.state
        const usernameError = username.length == 0
        const passwordError = password.length == 0
        if (usernameError || passwordError)
            this.setState({ usernameError, passwordError })
        else {
            this.setState({ dialogVisible: true, loading: true })
            const res = await fetchJSON('mauth', { username, password })
            if (res != null) {
                if (res.msg)
                    switch (res.msg) {
                        case 'PASSWORD_ERROR':
                            this.setState({
                                errorMsg: 'Password entered is wrong',
                                loading: false
                            })
                            break
                        case 'USERNAME_ERROR':
                            this.setState({
                                errorMsg: 'Username does not exist',
                                loading: false
                            })
                            break
                        default:
                            this.setState({
                                errorMsg: undefined,
                                loading: false
                            })
                    }
                else {
                    this.setState({
                        errorMsg: undefined,
                        loading: true,
                        dialogVisible: false
                    })
                    await AsyncStorage.setItem('isLoggedIn', 'true')
                    await AsyncStorage.setItem('token', res.token)
                    this.props.navigation.dispatch(CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'scanner' }]
                    }));
                }
            }
            else
                this.setState({ loading: false })
        }
    }

    checkLoginStatus = async () => {
        try {
            let isLoggedIn = await AsyncStorage.getItem("isLoggedIn")

            if (isLoggedIn === null)
                isLoggedIn = "false"

            if (isLoggedIn === "true")
                setTimeout(() => {
                    this.props.navigation.dispatch(CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'scanner' }]
                    }))
                }, 300)
            else
                this.setState({
                    dontShowLogin: false
                })
        } catch (err) {
            console.log(err)
        }
    }

}

export default Login