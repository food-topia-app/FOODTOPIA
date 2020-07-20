import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import QRCode from 'react-native-qrcode-svg'

import BackIcon from '../icons/back.png'

class QRCodeScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.topBar}>
                    <TouchableOpacity onPress={this.props.navigation.goBack}>
                        <Image
                            source={BackIcon}
                            style={{ width: 25, height: '100%', marginLeft: 10, marginRight: 10 }}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.contents}>
                    <Text style={styles.message}>
                        Show this QR Code to collect your order.
                    </Text>
                    <View
                        style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
                    >
                        <QRCode
                            value={this.props.route.params.orderId}
                            size={200}
                        />
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    topBar: {
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    contents: {
        flex: 10,
        backgroundColor: 'white',
    },
    message: {
        fontSize: 18,
        color: 'grey',
        width: '80%',
        alignSelf: 'center',
        textAlign: 'center'
    }
})

export default QRCodeScreen