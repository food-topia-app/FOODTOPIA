import React, { Component } from 'react';
import {
    View, Text, StyleSheet, TouchableNativeFeedback, FlatList, Modal,
    TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import ClickableCartView from '../components/ClickableCartView';

import { removeProduct } from '../actions/productActions'

class CartScreen extends Component {

    state = {
        isCartEmpty: true,
        totalAmount: 0,
        updateCart: false,
        popupVisible: false
    }

    componentDidMount() {
        let totalAmount = 0;
        const products = this.props.products;
        products.some((element) => {
            let tmpAmount = element.count * element.item.rate;
            totalAmount += tmpAmount;
        });
        this.setState({ isCartEmpty: !(products.length > 0), totalAmount: totalAmount });
    }

    componentDidUpdate(prevProps) {
        const products = this.props.products;
        if (prevProps.products !== products) {
            let totalAmount = 0;
            products.some((element) => {
                let tmpAmount = element.count * element.item.rate;
                totalAmount += tmpAmount;
            });
            this.setState({ isCartEmpty: !(products.length > 0), totalAmount: totalAmount });
        }
    }

    render() {
        return (
            <>
                <View
                    style={[styles.container, {
                        opacity: this.state.popupVisible ? 0.3 : 1.0
                    }]}>
                    <View
                        style={styles.topBar}>
                        <Text
                            style={{
                                fontSize: 17, fontWeight: 'bold', marginLeft: 10,
                                color: '#212121'
                            }}
                        >Cart</Text>
                    </View>
                    {
                        this.state.isCartEmpty && <View style={styles.contents}>
                            <Text style={{ fontSize: 17, fontWeight: 'bold', marginLeft: 10 }}>
                                You cart is empty!
                        </Text>
                        </View>
                    }
                    {
                        !this.state.isCartEmpty && <View style={{ flex: 9, width: '100%' }}>
                            <FlatList
                                data={this.props.products}
                                renderItem={this.renderItems}
                                keyExtractor={(item, index) => index.toString()}
                                contentContainerStyle={{ width: '100%' }}
                                style={{ marginTop: 10 }}
                                extraData={this.state.updateCart} />
                        </View>
                    }
                    {
                        !this.state.isCartEmpty && <View
                            style={{
                                width: '100%', alignItems: 'center', justifyContent: 'center',
                                margin: 10
                            }}
                        >
                            <TouchableNativeFeedback onPress={this.checkoutPressed}>
                                <View style={{
                                    height: 50, width: '90%', borderRadius: 5, alignItems: 'center',
                                    justifyContent: 'center', backgroundColor: '#00e676',
                                    elevation: this.state.popupVisible ? 0 : 2
                                }}>
                                    <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
                                        {'₹' + this.state.totalAmount + ', Checkout'}
                                    </Text>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                    }

                </View>
                <Modal
                    visible={this.state.popupVisible}
                    transparent={true}
                    animationType={"fade"}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                        <View style={{
                            alignItems: 'center', justifyContent: 'center', width: '70%', height: '30%',
                            elevation: 5, borderRadius: 10, borderWidth: 2, backgroundColor: 'white',
                            borderColor: 'white', padding: 20
                        }}>
                            <Text
                                style={{
                                    flex: 1, textAlignVertical: 'bottom', fontSize: 14,
                                    textAlign: 'center'
                                }}>
                                Minimum amount of order should be ₹ 100!
                            </Text>
                            <TouchableOpacity
                                style={{ flex: 1, justifyContent: 'center' }}
                                onPress={() => { this.setState({ popupVisible: false }) }}
                            >
                                <Text style={{ color: '#1e88e5', fontSize: 14, fontWeight: 'bold' }}>Okay</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </>
        );
    }

    renderItems = ({ item }) => {
        return (
            <ClickableCartView
                item={item}
                onPress={this.itemPressed}
                onDelete={this.itemDelete}
                elevation={this.state.popupVisible ? 0 : 2}
            />
        );
    }

    itemPressed = (item) => {
        this.props.navigation.navigate('productScreen', { item: item });
    }

    updateCartNow = () => {
        let totalAmount = 0;
        let products = this.props.products;
        products.some((element) => {
            let tmpAmount = element.count * element.item.rate;
            totalAmount += tmpAmount;
        });
        this.setState({ updateCart: true, totalAmount: totalAmount });
    }

    itemDelete = (item) => {
        this.props.removeProduct(item);
        let totalAmount = 0;
        let products = this.props.products;
        if (products.length > 0)
            this.setState({ isCartEmpty: false });
        products.some((element) => {
            let tmpAmount = element.count * element.item.rate;
            totalAmount += tmpAmount;
        });
        this.setState({ isCartEmpty: !(products.length > 0), totalAmount: totalAmount, updateCart: true });
    }

    checkoutPressed = () => {
        // if (this.state.totalAmount < 100)
        //     this.setState({ popupVisible: true })
        // else
            this.props.navigation.navigate('checkoutScreen', {
                totalAmount: this.state.totalAmount,
                items: this.props.products
            });
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
        backgroundColor: 'white'
    },
    contents: {
        width: '100%',
        flex: 10,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    }
})

const mapStateToProps = (state) => {
    return ({
        products: state.product.products
    });
}

const mapDispatchToProps = (dispatch) => {
    return ({
        removeProduct: (item) => dispatch(removeProduct(item))
    });
}

export default connect(mapStateToProps, mapDispatchToProps)(CartScreen);