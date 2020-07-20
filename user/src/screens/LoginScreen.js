import React, { Component } from 'react';
import {
    View, Text, TouchableNativeFeedback, TextInput, Modal, TouchableOpacity,
    Animated, Image, BackHandler
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { CommonActions } from '@react-navigation/native';
import messaging, { firebase } from '@react-native-firebase/messaging'
import auth from '@react-native-firebase/auth';
import { connect } from 'react-redux';

import { updateFCMToken } from '../actions/settingsActions'
import AndroidNotification from '../utils/AndroidNotification'
import LoadingView from '../components/LoadingView';
import { fetchJSON } from '../utils/Common'
import AppLogo from '../icons/logo.png'

class LoginScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            phoneNumber: "",
            otp: "",
            phoneNumberError: false,
            otpError: false,
            showPhoneNumberInput: true,
            exitTransitionValue: new Animated.Value(1),
            entryTransitionValue: new Animated.Value(0),
            popupVisible: false,
            popupText: '',
            statusText: '',
            verifying: false,
            fadeInBottom: new Animated.Value(0),
            confirmation: undefined
        }
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        this.initFirebase()
    }

    componentWillUnmount() {
        this.backHandler.remove()
    }

    render() {
        return (
            <>
                <View
                    style={{
                        flex: 1, backgroundColor: 'white', alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Image
                        style={{ width: '50%', height: '50%' }}
                        source={AppLogo}
                        resizeMode='contain'
                    />
                </View>
                <Animated.View
                    style={{
                        backgroundColor: 'white', alignItems: 'center',
                        opacity: this.state.popupVisible ? 0.5 : (
                            this.state.fadeInBottom.interpolate({
                                inputRange: [0, 1], outputRange: [0, 1]
                            })
                        ),
                        height: this.state.fadeInBottom.interpolate({
                            inputRange: [0, 1], outputRange: [0, 170]
                        })
                    }}
                >
                    {
                        this.state.showPhoneNumberInput &&
                        <Animated.View
                            style={{
                                alignItems: 'center', width: '100%',
                                opacity: this.state.exitTransitionValue.interpolate({
                                    inputRange: [0, 1], outputRange: [0, 1]
                                }),
                                transform: [{
                                    translateX: this.state.exitTransitionValue.interpolate({
                                        inputRange: [0, 1], outputRange: [-100, 0]
                                    })
                                }]
                            }}
                        >
                            <View style={{ flexDirection: 'row' }}>
                                <Text
                                    style={{
                                        borderBottomColor: this.state.phoneNumberError ? '#e53935' : '#25b7d3',
                                        width: '20%', paddingRight: 5, textAlignVertical: 'center',
                                        borderBottomWidth: 1, textAlign: 'right'
                                    }}
                                >+91
                                </Text>
                                <TextInput
                                    style={{
                                        width: '40%', height: 50, borderBottomWidth: 1,
                                        textAlign: 'left', fontSize: 15,
                                        borderBottomColor: this.state.phoneNumberError ? '#e53935' : '#25b7d3'
                                    }}
                                    placeholder='Phone Number'
                                    defaultValue={this.state.phoneNumber}
                                    keyboardType='numeric'
                                    onChangeText={(text) => { this.state.phoneNumber = text; }}
                                />
                            </View>
                        </Animated.View>
                    }
                    {
                        !this.state.showPhoneNumberInput &&
                        <Animated.View
                            style={{
                                width: '100%', alignItems: 'center',
                                opacity: this.state.entryTransitionValue.interpolate({
                                    inputRange: [0, 1], outputRange: [0, 1]
                                }),
                                transform: [{
                                    translateX: this.state.entryTransitionValue.interpolate({
                                        inputRange: [0, 1], outputRange: [100, 0]
                                    })
                                }]
                            }}
                        >
                            <TextInput
                                style={{
                                    width: '70%', height: 50, borderBottomWidth: 1,
                                    textAlign: 'center', fontSize: 15,
                                    borderBottomColor: this.state.otpError ? '#e53935' : '#25b7d3'
                                }}
                                placeholder='OTP'
                                onChangeText={(text) => { this.state.otp = text }}
                                keyboardType="numeric"
                                defaultValue={this.state.otp} />
                        </Animated.View>
                    }
                    <Text style={{ margin: 10 }}> {this.state.statusText} </Text>
                    <TouchableNativeFeedback
                        onPress={this.continuePressed}
                        disabled={this.state.verifying}>
                        <View style={{
                            alignItems: 'center', justifyContent: 'center', width: 250, height: 50,
                            borderRadius: 20, backgroundColor: '#25b7d3'
                        }}>
                            {
                                this.state.verifying ? (<LoadingView color='white' />) : (
                                    <Text style={{ fontSize: 15, color: 'white' }}>
                                        {this.state.showPhoneNumberInput ? 'Continue' : 'Verify'}
                                    </Text>
                                )
                            }
                        </View>
                    </TouchableNativeFeedback>
                    <Text style={{ padding: 10, fontSize: 10 }}>
                        Before using the app, you must VERIFY your phone number
                    </Text>
                </Animated.View>
                <Modal
                    visible={this.state.popupVisible}
                    transparent={true}
                    animationType={"fade"}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                        <View
                            style={{
                                alignItems: 'center', justifyContent: 'center', width: '70%', height: '30%',
                                elevation: 5, borderRadius: 10, borderWidth: 2, backgroundColor: 'white',
                                borderColor: 'white'
                            }}>
                            <Text style={{ flex: 1, textAlignVertical: 'bottom', fontSize: 14 }}>
                                {this.state.popupText}
                            </Text>
                            <TouchableOpacity
                                style={{ flex: 1, justifyContent: 'center' }}
                                onPress={this.popupDismiss}
                            >
                                <Text style={{ color: '#1e88e5', fontSize: 14, fontWeight: 'bold' }}>
                                    Try again?
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </>
        );
    }

    handleBackPress = () => {
        if (this.state.showPhoneNumberInput)
            return false;
        else {
            this.backPressed();
            return true;
        }
    }

    continuePressed = async () => {
        if (this.state.showPhoneNumberInput) {
            let phoneNumber = this.state.phoneNumber;
            let error = false;

            if (phoneNumber.length !== 10)
                error = true;
            else if (phoneNumber.replace(/[0-9]/g, '').length !== 0)
                error = true;

            if (error)
                this.setState({ phoneNumberError: true });
            else {
                try {
                    const confirmation = await auth().signInWithPhoneNumber('+91' + phoneNumber)
                    this.setState({ phoneNumberError: false, confirmation })
                    Animated.timing(this.state.exitTransitionValue, {
                        toValue: 0, duration: 100, useNativeDriver: true, delay: 0
                    }).start((result) => {
                        this.setState({ showPhoneNumberInput: false });
                        Animated.timing(this.state.entryTransitionValue, {
                            toValue: 1, duration: 100, useNativeDriver: true, delay: 0
                        }).start()
                    });
                }
                catch (err) {
                    console.log(err)
                    this.setState({ statusText: "Failed to send OTP, try again." })
                }
            }
        }
        else {
            let otp = this.state.otp;
            let error = false;

            if (otp.length === 0)
                error = true;
            else if (otp.replace(/[0-9]/g, '').length !== 0)
                error = true;

            if (error)
                this.setState({ otpError: true });
            else {
                this.setState({ otpError: false, statusText: 'Please Wait...', verifying: true });
                try {
                    await this.state.confirmation.confirm(otp)
                    this.login()
                } catch (error) {
                    console.log(error)
                    this.setState({
                        statusText: "OTP verification failed. Try again.",
                        otpError: true,
                        verifying: false
                    });
                }
            }
        }
    }

    backPressed = () => {
        Animated.timing(this.state.entryTransitionValue, {
            toValue: 0, duration: 100, useNativeDriver: true, delay: 0
        }).start((result) => {
            this.setState({ showPhoneNumberInput: true });
            Animated.timing(this.state.exitTransitionValue, {
                toValue: 1, duration: 100, useNativeDriver: true, delay: 0
            }).start(this.startEntryAnimation);
        });
    }

    login = async () => {
        let responseJSON = await fetchJSON('mauth', {
            phoneNumber: this.state.phoneNumber,
            fcmToken: this.props.fcmToken
        });
        if (responseJSON != null) {
            switch (responseJSON.status) {
                case "user-verified": {
                    await AsyncStorage.setItem("isLoggedIn", "true");
                    await AsyncStorage.setItem("token", responseJSON.token);
                    await AsyncStorage.setItem("fcmToken", this.props.fcmToken);
                    this.props.navigation.dispatch(CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'oneTimeProfileScreen' }]
                    }));
                    break;
                }
            }
        }
        else
            this.setState({ popupVisible: true, popupText: 'Network error, try again later!' });
    }

    popupDismiss = () => {
        this.setState({ popupVisible: false });
        this.login();
    }

    startFadeInAnim = () => {
        Animated.timing(this.state.fadeInBottom, {
            toValue: 1, duration: 300, delay: 300
        }).start()
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
                        routes: [{ name: 'mainScreen' }]
                    }))
                }, 300)
            else
                this.startFadeInAnim()
        } catch (err) {
            console.log(err)
        }
    }

    initFirebase = async () => {
        await messaging().registerDeviceForRemoteMessages()
        await this.getMessagingToken()
        this.receiveForegroundMessages()
        this.receiveBackgroundMessages()
    }

    receiveForegroundMessages = () => {
        messaging().onMessage(async remoteMessage => {
            const { title, message } = remoteMessage.data
            AndroidNotification.showNotification(title, message)
        })
    }

    receiveBackgroundMessages = () => {
        messaging().setBackgroundMessageHandler(async remoteMessage => {
            console.log('Background Message Received', remoteMessage)
        })
    }

    getMessagingToken = async () => {
        const fcmToken = await firebase.messaging().getToken()
        this.props.updateFcmToken(fcmToken)
        this.checkLoginStatus()
    }

}

const mapStateToProps = (state) => ({
    fcmToken: state.settings.fcmToken
})

const mapDispatchToProps = (dispatch) => ({
    updateFcmToken: (fcmToken) => dispatch(updateFCMToken(fcmToken))
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);