import React, { Component } from 'react';
import { TouchableNativeFeedback, View, Image, Dimensions, Text } from 'react-native';

import { Server } from '../utils/Common'

const window = Dimensions.get('window');
const cardWidth = window.width * 0.85;
const cardHeight = cardWidth * 0.8625;

class ProductView extends Component {

    render() {
        return (
            <TouchableNativeFeedback onPress={this.onClick}>
                <View style={{
                    height: cardHeight, width: cardWidth, elevation: 2, borderRadius: 5,
                    backgroundColor: 'white', margin: 15, padding: 10
                }}>
                    <Image
                        source={{ uri: Server + '/img/' + this.props.item._id }}
                        style={{ width: '100%', height: '85%' }}
                        resizeMode='cover'
                    />
                    <Text
                        style={{ fontSize: 16, marginTop: 10 }}
                    >
                        {this.props.item.name}
                    </Text>
                </View>
            </TouchableNativeFeedback>
        );
    }

    onClick = () => {
        this.props.onPress(this.props.item);
    }

    shouldComponentUpdate() {
        return false;
    }
}

export default ProductView;