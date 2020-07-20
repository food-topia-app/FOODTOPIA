import React, { Component } from 'react'
import { View, Text, TouchableNativeFeedback } from 'react-native'

class BigButton extends Component {

    render() {
        const { text, onPress, style, textStyle, contentContainerStyle } = this.props
        return (
            <View style={{width: '50%', ...style}}>
            <TouchableNativeFeedback onPress={onPress}>
                <View style={{
                    width: '100%', height: 60, backgroundColor: '#25b7d3', elevation: 5,
                    borderRadius: 5, alignItems: 'center', justifyContent: 'center',
                    ...contentContainerStyle
                }}>
                    <Text style={{ fontSize: 18, color: 'white', ...textStyle }}>
                        {text}
                    </Text>
                </View>
                </TouchableNativeFeedback>
                </View>
        )
    }
}

export default BigButton