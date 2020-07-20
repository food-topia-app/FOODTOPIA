import React, { Component } from 'react';
import {
    Text, View, TouchableNativeFeedback, Image, StyleSheet
} from 'react-native';

import { Server } from '../utils/Common'

class ClickableCartView extends Component {

    state = {
        updateComponent: false
    }

    render() {
        const count = this.props.item.count;
        const tmpItem = this.props.item.item;
        return (
            <View style={{
                alignItems: 'center', elevation: this.props.elevation, borderRadius: 5, marginLeft: 10,
                marginRight: 10, marginBottom: 5, backgroundColor: 'white', marginTop: 5, padding: 10
            }}>
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                    <Image
                        source={{ uri: Server + '/img/' + tmpItem._id }}
                        resizeMode='contain'
                        style={{ flex: 1 }}
                    />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={{ fontSize: 20 }}>{tmpItem.name}</Text>
                        <Text style={styles.greyText}>{'Quantity: ' + count}</Text>
                        <Text style={styles.greyText}>
                            {"₹ " + tmpItem.rate + " / " + tmpItem.quantity + ' ' + tmpItem.unit}
                        </Text>
                        <Text style={styles.greyText}>
                            {"Total: ₹" + (tmpItem.rate * count)}
                        </Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableNativeFeedback onPress={this.onClick}>
                        <View style={{
                            flex: 1, height: 40, borderRadius: 5, backgroundColor: 'white',
                            alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Text style={{ color: '#1e88e5', fontWeight: 'bold', fontSize: 16 }}>Edit</Text>
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={this.onDelete}>
                        <View style={{
                            flex: 1, height: 40, borderRadius: 5, backgroundColor: 'white',
                            alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Text style={{ color: '#f44336', fontWeight: 'bold', fontSize: 16 }}>Delete</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </View>
        );
    }

    onClick = () => {
        this.props.onPress(this.props.item.item);
    }

    onDelete = () => {
        this.props.onDelete(this.props.item.item);
        this.state.updateComponent = false;
    }
}

const styles = StyleSheet.create({
    greyText: {
        fontSize: 18,
        color: 'grey'
    }
})

export default ClickableCartView;