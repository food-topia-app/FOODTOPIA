import React, { Component } from 'react';
import {
    View, Text, StyleSheet, Image, TouchableOpacity, Modal, TextInput, Dimensions,
    TouchableNativeFeedback
} from 'react-native';
import LoadingView from '../components/LoadingView';
import { CommonActions } from '@react-navigation/native';

const Common = require('../utils/Common');

class OneTimeProfileScreen extends Component {

    state = {
        showEditMenu: false,
        name: "",
        address: "",
        pincode: "",
        nameError: false,
        addressError: false,
        pincodeError: false,
        modalHeight: 0,
        updating: false,
        networkError: false,
        loading: true,
        loadingError: false,
    }

    componentDidMount() {
        this.state.modalHeight = Dimensions.get('window').height * 0.5;
        this.loadContents();
    }

    render() {
        return (
            <View style={styles.container}>
                <View
                    style={styles.topBar}
                    opacity={this.getOpacity()}
                >
                    <Text style={{ fontSize: 17, fontWeight: 'bold', marginLeft: 10, flex: 1 }}>
                        Enter Personal Details
                    </Text>
                    <TouchableOpacity onPress={this.skip}>
                        <Text style={{ fontSize: 16, color: '#25b7d3', paddingRight: 10 }}>
                            Skip
                        </Text>
                    </TouchableOpacity>
                </View>
                <View
                    style={styles.contents}
                    opacity={this.getOpacity()}
                >
                    <View
                        style={{
                            flex: 1, justifyContent: 'center', alignItems: 'center',
                            padding: 40
                        }}>
                        <Text style={{ textAlign: 'center', fontSize: 18, color: 'grey' }}>
                            Enter your personal details for faster checkouts.
                            You can always edit these details later!
                        </Text>
                    </View>
                    {
                        !this.state.loading &&
                        <View style={{ flex: 3, alignItems: 'center', marginBottom: 20 }}>
                            <TextInput
                                onChangeText={(text) => { this.state.name = text }}
                                defaultValue={this.state.name}
                                style={{
                                    width: '80%', borderWidth: 1, borderRadius: 10, padding: 10,
                                    borderColor: this.state.nameError ? '#e53935' : '#25b7d3',
                                    marginTop: 10
                                }}
                                placeholder='Name'
                            />
                            <TextInput
                                onChangeText={(text) => { this.state.address = text }}
                                defaultValue={this.state.address}
                                style={{
                                    width: '80%', borderWidth: 1, borderRadius: 10, padding: 10,
                                    borderColor: this.state.addressError ? '#e53935' : '#25b7d3',
                                    marginTop: 10
                                }}
                                placeholder='Admission No. (or ID)'
                            />
                            <TextInput
                                onChangeText={(text) => { this.state.pincode = text }}
                                defaultValue={this.state.pincode}
                                style={{
                                    width: '80%', borderWidth: 1, borderRadius: 10, padding: 10,
                                    borderColor: this.state.pincodeError ? '#e53935' : '#25b7d3',
                                    marginTop: 10
                                }}
                                placeholder='Dept.'
                            />
                            {
                                (!this.state.loading && !this.state.updating) &&
                                <View
                                    style={{
                                        flex: 2, width: '100%', justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    <TouchableNativeFeedback
                                        onPress={this.updateDetails}>
                                        <View
                                            style={{
                                                alignItems: 'center', justifyContent: 'center', width: 250,
                                                height: 50, borderRadius: 20, backgroundColor: '#25b7d3'
                                            }}
                                        >
                                            <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>
                                                {this.state.networkError ? 'Error, Try again?' : 'Update'}
                                            </Text>
                                        </View>
                                    </TouchableNativeFeedback>
                                </View>
                            }
                            {
                                (!this.state.loading && this.state.updating) &&
                                <View style={{ flex: 2, justifyContent: 'center' }}>
                                    <LoadingView />
                                </View>
                            }
                        </View>
                    }
                    {
                        this.state.loading &&
                        <View style={{ flex: 3, justifyContent: 'center' }}>
                            <LoadingView />
                        </View>
                    }
                </View>
                <Modal
                    visible={this.state.loadingError}
                    transparent={true}
                    animationType={"fade"}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                        <View
                            style={{
                                alignItems: 'center', justifyContent: 'center', width: '70%', height: '30%',
                                elevation: 5, borderRadius: 10, borderWidth: 2, backgroundColor: 'white',
                                borderColor: 'white'
                            }}
                        >
                            <Text style={{ flex: 1, textAlignVertical: 'bottom', fontSize: 14 }}>
                                Can't connect to server, try again!
                            </Text>
                            <TouchableOpacity
                                style={{ flex: 1, justifyContent: 'center' }}
                                onPress={this.loadContents}>
                                <Text style={{ color: '#1e88e5', fontSize: 14, fontWeight: 'bold' }}>
                                    Try Again?
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View >
        );
    }

    updateDetails = async () => {
        let name = this.state.name;
        let address = this.state.address;
        let pincode = this.state.pincode;

        let nameError = name.length === 0;
        let addressError = address.length === 0;
        let pincodeError = pincode.length === 0;

        if (!(nameError || addressError || pincodeError)) {
            this.setState({
                nameError: nameError,
                addressError: addressError,
                pincodeError: pincodeError,
                updating: true
            });
            let responseJSON = await Common.fetchJSON('mauth',
                {
                    name: this.state.name,
                    address: this.state.address,
                    pincode: this.state.pincode
                }, 'PUT');

            if (responseJSON != null) {
                this.setState({
                    updating: false,
                    networkError: false,
                });
                this.props.navigation.dispatch(CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'mainScreen' }]
                }));
            }
            else
                this.setState({ updating: false, networkError: true });
        }
        else
            this.setState({
                nameError: nameError,
                addressError: addressError,
                pincodeError: pincodeError
            });
    }

    loadContents = async () => {
        this.setState({ loadingError: false, loading: true });
        let user = await Common.fetchJSON('mauth', {}, 'GET');
        if (user != null)
            this.setState({
                loading: false,
                name: user.name,
                address: user.address,
                pincode: user.pincode
            });
        else
            this.setState({ loadingError: true, loading: false });
    }

    getOpacity = () => {
        if (this.state.logoutPopup)
            return 0.3;
        if (this.state.loadingError)
            return 0.3;
        if (this.state.showEditMenu)
            return 0.3;
        return 1;
    }

    skip = () => {
        this.props.navigation.dispatch(CommonActions.reset({
            index: 0,
            routes: [{ name: 'mainScreen' }]
        }));
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    contents: {
        width: '100%',
        flex: 10
    },
    topBar: {
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white'
    }
})

export default OneTimeProfileScreen;