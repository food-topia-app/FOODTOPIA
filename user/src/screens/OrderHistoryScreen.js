import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LoadingView from '../components/LoadingView';
import { FlatList } from 'react-native-gesture-handler';
import OrderHistoryCardView from '../components/OrderHistoryCardView';
import { connect } from 'react-redux'

import { resetOrderHistory } from '../actions/orderActions'

const Common = require('../utils/Common');

class OrderHistoryScreen extends Component {

    state = {
        orderHistory: [],
        orderHistoryAvailable: false,
        loading: true,
        loadingError: false
    }

    componentDidMount() {
        this.fetchOrderHistory();
    }

    componentDidUpdate() {
        if (this.props.orderReset) {
            this.props.resetOrderHistory(false)
            this.fetchOrderHistory()
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.topBar}>
                    <Text
                        style={{
                            fontSize: 17, fontWeight: 'bold', marginLeft: 10,
                            color: '#212121', flex: 1
                        }}>
                        Order History
                    </Text>
                </View>
                <View style={styles.contents} opacity={this.state.cancelPopup ? 0.3 : 1.0}>
                    {
                        (!this.state.loading && !this.state.orderHistoryAvailable) &&
                        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                            <Text
                                style={{ fontSize: 17, fontWeight: 'bold', marginLeft: 10 }}>
                                You don't have any orders!
                        </Text>
                        </View>
                    }
                    {
                        this.state.loading &&
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <LoadingView />
                        </View>
                    }
                    {
                        (!this.state.loading && this.state.loadingError) &&
                        <Text
                            style={{ fontSize: 17, fontWeight: 'bold', marginLeft: 10 }}>
                            Server Unreachable! Try again.
                        </Text>
                    }
                    {
                        (!this.state.loading && this.state.orderHistoryAvailable && !this.state.loadingError) &&
                        <FlatList
                            data={this.state.orderHistory}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={this.renderOrderHistory}
                        />
                    }
                </View>
            </View>
        );
    }

    fetchOrderHistory = async () => {
        let responseJSON = await Common.fetchJSON('morder', {}, 'GET');
        if (responseJSON !== null) {
            responseJSON.reverse();
            this.setState({ loading: false, orderHistoryAvailable: responseJSON.length > 0, orderHistory: responseJSON });
        }
        else
            this.setState({ loading: false, orderHistoryAvailable: true, loadingError: true });
    }

    renderOrderHistory = ({ item }) => {
        return (
            <OrderHistoryCardView item={item} onPress={this.orderClicked} />
        );
    }

    orderClicked = order => {
        this.props.navigation.navigate('orderScreen', { order })
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
    }
})

const mapStateToProps = state => ({
    orderReset: state.order.orderReset
})

const mapDispatchToProps = dispatch => ({
    resetOrderHistory: (reset) => dispatch(resetOrderHistory(reset))
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderHistoryScreen);