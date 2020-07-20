import React, { Component } from 'react';
import {
    View, Text, StyleSheet, Modal, TouchableOpacity, Image,
    ScrollView, TouchableNativeFeedback
} from 'react-native';
import { connect } from 'react-redux'

import LoadingView from '../components/LoadingView';
import { resetOrderHistory } from '../actions/orderActions'
import { fetchJSON } from '../utils/Common'
import BackIcon from '../icons/back.png'


class OrderScreen extends Component {

    state = {
        cancelPopup: false,
        cancelling: false,
        cancelFailed: false,
        cancelComplete: false
    }

    render() {
        const order = this.props.route.params.order
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
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity onPress={this.showQRCode}>
                        <Text style={{
                            color: '#1e88e5', paddingRight: 10, height: '100%',
                            textAlignVertical: 'center'
                        }}>
                            Show QR Code
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.contents} opacity={this.state.cancelPopup ? 0.3 : 1.0}>
                    <ScrollView>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Order Details</Text>
                        <Text style={styles.textStyle}>{'Order ID: ' + order.orderId}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.textStyle}>Order Status: </Text>
                            <Text style={{
                                fontSize: 16, marginTop: 10,
                                color: this.getStatusColor(order.status)
                            }}>
                                {order.status}
                            </Text>
                        </View>
                        <Text style={styles.textStyle}>{'Total Amount: ₹ ' + order.amount}</Text>
                        <Text style={styles.textStyle}>{"Date-Time: " + order.date + ', ' + order.time}</Text>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>Items</Text>
                        {
                            order.items.map(this.renderSubItems)
                        }
                    </ScrollView>
                    {
                        order.status === 'Pending Payment' &&
                        <View
                            style={{
                                flexDirection: 'row', alignContent: 'center', paddingTop: 20,
                                justifyContent: 'space-evenly'
                            }}
                        >
                            <TouchableNativeFeedback>
                                <View
                                    style={[styles.buttonStyle, {
                                        backgroundColor: '#1e88e5', elevation: this.state.cancelPopup ? 0 : 5
                                    }]}
                                >
                                    <Text style={styles.buttonTextStyle}>Retry Payment</Text>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback onPress={this.cancelOrderPopup}>
                                <View
                                    style={[styles.buttonStyle, {
                                        backgroundColor: '#e53935', elevation: this.state.cancelPopup ? 0 : 5
                                    }]}
                                >
                                    <Text style={styles.buttonTextStyle}>Cancel Order</Text>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                    }
                </View>
                <Modal
                    visible={this.state.cancelPopup}
                    transparent={true}
                    animationType={"fade"}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                        <View style={{
                            alignItems: 'center', justifyContent: 'center', width: '70%', height: '30%', elevation: 5,
                            borderRadius: 10, borderWidth: 2, backgroundColor: 'white', borderColor: 'white'
                        }}>
                            {
                                (!this.state.cancelling && !this.state.cancelComplete && !this.state.cancelFailed) && <View
                                    style={{ flex: 1, width: '100%', alignItems: 'center' }}>
                                    <Text style={{ flex: 1, textAlignVertical: 'bottom', fontSize: 14 }}>Cancel Order?</Text>
                                    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                                        <TouchableOpacity style={{ flex: 1, justifyContent: 'center' }}
                                            onPress={this.cancelOrderConfirmed}>
                                            <Text
                                                style={{ color: '#f44336', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
                                                Yes
                                                </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ flex: 1, justifyContent: 'center' }}
                                            onPress={() => { this.setState({ cancelPopup: false }); }}>
                                            <Text
                                                style={{ color: '#1e88e5', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
                                                Dismiss
                                                </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            }
                            {
                                (!this.state.cancelling && !this.state.cancelComplete && this.state.cancelFailed) && <View
                                    style={{ flex: 1 }}>
                                    <Text style={{ flex: 1, textAlignVertical: 'bottom', fontSize: 14 }}>Cancellation Failed</Text>
                                    <TouchableOpacity style={{ flex: 1, justifyContent: 'center' }}
                                        onPress={() => {
                                            this.setState({
                                                cancelFailed: false,
                                                cancelling: false,
                                                cancelPopup: false,
                                                cancelComplete: false
                                            });
                                        }}>
                                        <Text
                                            style={{ color: '#1e88e5', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
                                            Okay
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            }
                            {
                                this.state.cancelling && <LoadingView />
                            }
                            {
                                (!this.state.cancelling && this.state.cancelComplete && !this.state.cancelFailed) && <View
                                    style={{ flex: 1 }}>
                                    <Text style={{ flex: 1, textAlignVertical: 'bottom', fontSize: 14 }}>Order Cancelled</Text>
                                    <TouchableOpacity style={{ flex: 1, justifyContent: 'center' }}
                                        onPress={() => {
                                            this.setState({
                                                cancelFailed: false,
                                                cancelling: false,
                                                cancelPopup: false,
                                                cancelComplete: false,
                                            });
                                            this.props.navigation.goBack()
                                        }}>
                                        <Text
                                            style={{ color: '#1e88e5', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
                                            Okay</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }

    cancelOrderPopup = () => {
        this.setState({ cancelPopup: true });
    }

    cancelOrderConfirmed = async () => {
        this.setState({ cancelling: true });
        const { _id } = this.props.route.params.order
        let responseJSON = await fetchJSON('morder', { id: _id }, 'PUT');
        if (responseJSON !== null) {
            if (responseJSON.status === "order-cancelled") {
                this.setState({ cancelling: false, cancelFailed: false, cancelComplete: true });
                this.props.resetOrderHistory(true)
            }
            else
                this.setState({ cancelling: false, cancelFailed: true, cancelComplete: false });
        }
        else
            this.setState({ cancelling: false, cancelFailed: true });
    }

    getStatusColor = (status) => {
        switch (status) {
            case 'Cancelled': return 'red';
            case 'Pending Approval': return '#fbc02d';
            case 'Approved': return '#388e3c';
            case 'Delivered': return '#1e88e5'
            default: return 'black';
        }
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

    showQRCode = () => {
        this.props.navigation.navigate('qRCodeScreen', {
            orderId: this.props.route.params.order._id
        })
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    topBar: {
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        elevation: 2
    },
    contents: {
        width: '100%',
        flex: 10,
        backgroundColor: '#fafafa',
        padding: 20
    },
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
        justifyContent: 'center'
    },
    buttonTextStyle: {
        color: 'white'
    }
})

const mapDispatchToProps = dispatch => ({
    resetOrderHistory: (reset) => dispatch(resetOrderHistory(reset))
})

export default connect(null, mapDispatchToProps)(OrderScreen);