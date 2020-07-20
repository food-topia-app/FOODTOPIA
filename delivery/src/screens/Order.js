import React, { Component } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableNativeFeedback } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import { CommonActions } from '@react-navigation/native'

import { fetchJSON } from '../utils/Common'

class Order extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            errMsg: undefined,
            order: undefined
        }
    }

    componentDidMount() {
        this.getOrder()
    }

    render() {
        const { order } = this.state
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                {
                    this.state.loading ? (
                        this.state.errMsg ? (
                            <>
                                <Text
                                    style={{
                                        fontSize: 18, marginBottom: 20, width: '80%',
                                        textAlign: 'center'
                                    }}
                                >
                                    {this.state.errMsg}
                                </Text>
                                <TouchableNativeFeedback onPress={this.scanAgain}>
                                    <View style={styles.buttonStyle}>
                                        <Text style={styles.buttonTextStyle}>Scan Again</Text>
                                    </View>
                                </TouchableNativeFeedback>
                            </>
                        ) : (
                                <ActivityIndicator animating={true} size='large' />
                            )
                    ) : (
                            <>
                                <ScrollView
                                    style={{ width: '100%' }}
                                    contentContainerStyle={{ padding: 20 }}
                                >
                                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Order Details</Text>
                                    <Text style={styles.textStyle}>{'Order ID: ' + order.orderId}</Text>
                                    {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.textStyle}>Order Status: </Text>
                                    <Text style={{
                                        fontSize: 16, marginTop: 10,
                                        color: this.getStatusColor(order.status)
                                    }}>
                                        {order.status}
                                    </Text>
                                </View> */}
                                    <Text style={styles.textStyle}>{'Total Amount: ₹ ' + order.amount}</Text>
                                    <Text style={styles.textStyle}>
                                        {"Date-Time: " + order.date + ', ' + order.time}
                                    </Text>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>
                                        Items
                                        </Text>
                                    {
                                        order.items.map(this.renderSubItems)
                                    }
                                </ScrollView>
                                <View
                                    style={{
                                        flexDirection: 'row', alignItems: 'center', padding: 20,
                                        justifyContent: 'space-evenly', width: '100%',
                                    }}
                                >
                                    <TouchableNativeFeedback onPress={this.markAsDeliver}>
                                        <View style={styles.buttonStyle}>
                                            <Text style={styles.buttonTextStyle}>Mark as Delivered</Text>
                                        </View>
                                    </TouchableNativeFeedback>
                                    <TouchableNativeFeedback onPress={this.scanAgain}>
                                        <View style={styles.buttonStyle}>
                                            <Text style={styles.buttonTextStyle}>Scan Again</Text>
                                        </View>
                                    </TouchableNativeFeedback>
                                </View>
                            </>
                        )
                }
            </View>
        )
    }

    renderSubItems = (item, index) => {
        return (
            <View
                key={index}
                style={{
                    borderTopColor: 'gray', borderTopWidth: index !== 0 ? 1 : 0,
                    marginTop: index !== 0 ? 10 : 0
                }}
            >
                <Text style={styles.textStyle}>{item.item.name}</Text>
                {
                    <Text style={styles.textStyle}>{"Quantity: " + item.count}</Text>
                }
                <Text style={styles.textStyle}>
                    {'₹' + item.item.rate + " / " + item.item.quantity + ' ' + item.item.unit}
                </Text>
                <Text style={styles.textStyle}>
                    {"Total: ₹" + (item.item.rate * item.count)}
                </Text>
            </View>
        )
    }

    getOrder = async () => {
        const { id } = this.props.route.params
        const order = await fetchJSON('morder/' + id, {}, 'GET')
        if (order != null) {
            if (order.msg)
                switch (order.msg) {
                    case 'ORDER_NOT_FOUND':
                        this.setState({ errMsg: 'QR Code does not belong to any orders. Try again.' })
                        break
                    case 'ORDER_ALREADY_DELIVERED':
                        this.setState({ errMsg: 'This order is already delivered.' })
                        break
                    default:
                        this.setState({ errMsg: 'Network error, try again.' })
                }
            else
                this.setState({ order, loading: false, errMsg: undefined })
        }
        else
            this.setState({ errMsg: 'Network error, try again.' })
    }

    markAsDeliver = async () => {
        this.setState({ loading: true, errMsg: undefined })
        const { order } = this.state
        const res = await fetchJSON('morder', { id: order._id, status: 'Delivered' }, 'PUT')
        if (res != null)
            this.setState({ errMsg: 'Order Completed!' })
        else
            this.setState({ errMsg: 'Network Error, try again.' })
    }

    scanAgain = () => {
        this.props.navigation.dispatch(CommonActions.reset({
            index: 0,
            routes: [{ name: 'scanner' }]
        }))
    }

}

const styles = StyleSheet.create({
    textStyle: {
        fontSize: 16,
        marginTop: 10,
        paddingLeft: 20
    },
    buttonStyle: {
        width: '40%',
        height: 40,
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1e88e5',
        elevation: 5
    },
    buttonTextStyle: {
        color: 'white'
    }
})

export default Order