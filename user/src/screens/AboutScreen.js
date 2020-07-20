import React, { Component } from 'react';
import { View, Image, Text, Dimensions, TouchableOpacity } from 'react-native';

import {AppVersion} from '../utils/Common'
const logoDimension = Dimensions.get('window').width * 0.5;

class AboutScreen extends Component {
    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white' }}>
                    <TouchableOpacity onPress={this.backPressed}>
                        <Image source={require('../icons/back.png')} resizeMode='contain'
                            style={{ width: 30, height: 30, margin: 10 }} />
                    </TouchableOpacity>
                    <Image
                        source={require('../icons/logo.png')} resizeMode='contain'
                        style={{ width: logoDimension, height: logoDimension, alignSelf: 'center'}} />
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 30 }}>Foodtopia</Text>
                        <Text>{'v' + AppVersion}</Text>
                    </View>
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
                    <Text style={{ fontSize: 16 }}>Developed by</Text>
                    <Text>Group 21</Text>
                </View>
            </View>
        );
    }

    backPressed = () => {
        this.props.navigation.goBack();
    }
}

export default AboutScreen;