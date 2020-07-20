import React, { Component } from 'react';
import { Text, View, TouchableNativeFeedback, StyleSheet } from 'react-native';

class ClickableCardView extends Component {

    render() {
        let item = this.props.item;
        return (
            <TouchableNativeFeedback onPress={this.onPress}>
                <View
                    style={{
                        marginTop: 5, marginBottom: 5, elevation: 5,
                        backgroundColor: 'white', padding: 20
                    }}
                >
                    <Text style={{ fontSize: 16 }}>{'Order ID: ' + item.orderId}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.textStyle}>Order Status: </Text>
                        <Text style={[styles.textStyle, { color: this.getStatusColor(item.status) }]}>
                            {item.status}
                        </Text>
                    </View>
                    <Text style={styles.textStyle}>{'Total Amount: ₹ ' + item.amount}</Text>
                    <Text style={styles.textStyle}>{"Date-Time: " + item.date + ', ' + item.time}</Text>
                </View>
            </TouchableNativeFeedback>
        );
    }

    onPress = () => {
        this.props.onPress(this.props.item);
    }

    getStatusColor = (status) => {
        switch (status) {
            case 'Pending Payment': return 'red';
            case 'Pending Approval': return '#fbc02d';
            case 'Approved': return '#388e3c';
            case 'Delivered': return '#1e88e5'
            default: return 'black';
        }
    }

}

const styles = StyleSheet.create({
    textStyle: {
        fontSize: 16,
        marginTop: 10
    }
})

export default ClickableCardView;