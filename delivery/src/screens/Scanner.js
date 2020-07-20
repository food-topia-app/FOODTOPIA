import React, { Component } from 'react'
import { View, Text } from 'react-native'
import QRCodeScanner from 'react-native-qrcode-scanner'
import {CommonActions } from '@react-navigation/native'

class Scanner extends Component {
    render() {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <QRCodeScanner
                    onRead={this.onSuccess}
                    fadeIn={true}
                    showMarker={true}
                    // cameraProps={
                    //     cameraViewDimensions = {
                    //         width: 300,
                    //         height: 400
                    //     }
                    // }
                    // cameraStyle={{ width: 300, height: 400, alignSelf: 'center' }}
                    // containerStyle={{ width: 300 }}
                    // markerStyle={{ width: 180, height: 180 }}
                    topContent={
                        <Text>Scan QR Code to process order</Text>
                    }
                    topViewStyle={{ justifyContent: 'flex-start', paddingTop: 20}}
                />
            </View>
        )
    }

    onSuccess = e => {
        this.props.navigation.navigate('order', { id: e.data })
        this.props.navigation.dispatch(CommonActions.reset({
            index: 0,
            routes: [{ name: 'order', params: {id: e.data} }]
        }));
    }

}

export default Scanner