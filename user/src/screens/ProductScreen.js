import React, { Component } from 'react';
import {
    View, TouchableOpacity, Image, Text, StyleSheet, TouchableNativeFeedback,
    ScrollView, Modal
} from 'react-native'
import { connect } from 'react-redux';

import { updateProduct } from '../actions/productActions'
import { changeScreen } from '../actions/settingsActions'
import { fetchJSON, Server} from '../utils/Common'
import LoadingView from '../components/LoadingView'

class ProductScreen extends Component {

    state = {
        item: this.props.route.params.item,
        productCount: 1,
        productChanged: false,
        productAdded: false,
        stock: -1,
        loadingStock: true
    }

    componentDidMount() {
        let products = this.props.products;
        products.some((element) => {
            if (element.item._id == this.state.item._id)
                this.setState({
                    productCount: element.count,
                    productChanged: false,
                    productAdded: true
                });
        });
        this.fetchStock()
    }

    render() {
        const buttontext = this.getCartButtonText()
        const buttonColor = this.getCartButtonBGColor()
        return (
            <>
                <View
                    style={[styles.container,
                    {
                        opacity: this.state.loadingStock ? 0.3 : 1.0
                    }]}

                >
                    <View style={[styles.topBar, { elevation: this.state.loadingStock ? 0 : 2 }]}>
                        <TouchableOpacity onPress={() => {
                            this.props.navigation.goBack()
                        }}>
                            <Image source={require('../icons/back.png')}
                                style={{ width: 25, height: '100%', marginLeft: 10, marginRight: 10 }} resizeMode='contain' />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 9, width: '100%' }}>
                        <ScrollView>
                            <Image
                                style={{ width: '80%', height: 200, alignSelf: 'center', borderRadius: 2, marginTop: 10 }}
                                source={{ uri: Server + '/img/' + this.state.item._id }}
                                resizeMode='contain'
                            />
                            <View style={{ margin: 40 }}>
                                {
                                    this.state.stock == 0 &&
                                    <Text
                                        style={{
                                            alignSelf: 'center', color: 'red', fontWeight: 'bold', fontSize: 18
                                        }}
                                    >
                                        Out of stock!
                                </Text>
                                }
                                <Text style={{ fontSize: 20 }}>{this.state.item.name}</Text>
                                <Text style={{ fontSize: 18, color: 'gray' }}>{this.state.item.description}</Text>
                                <Text style={{ fontSize: 18, marginTop: 20 }}>
                                    {'₹' + this.state.item.rate + " / " + this.state.item.quantity + ' ' + this.state.item.unit}
                                </Text>
                                <View style={{
                                    width: 200, height: 40, marginTop: 20, flexDirection: 'row', alignItems: 'center',
                                    borderWidth: 1, borderColor: 'gray', alignSelf: 'center'
                                }}>
                                    <TouchableOpacity
                                        style={{ flex: 1, alignItems: 'center', padding: 10 }}
                                        onPress={() => {
                                            let newCount = this.state.productCount - 1;
                                            if (newCount >= 1)
                                                this.setState({
                                                    productCount: newCount,
                                                    productChanged: true
                                                });
                                        }}>
                                        <Text style={{ fontSize: 25 }}>-</Text>
                                    </TouchableOpacity>
                                    <Text style={{
                                        fontSize: 18, flex: 3, textAlign: 'center', borderColor: 'gray', borderLeftWidth: 1,
                                        borderRightWidth: 1
                                    }}>
                                        {' ' + this.state.productCount + (this.state.productCount > 1 ? ' items ' : ' item ')}
                                    </Text>
                                    <TouchableOpacity
                                        style={{ flex: 1, alignItems: 'center', padding: 10 }}
                                        onPress={() => {
                                            let newCount = this.state.productCount;
                                            if (this.state.stock != -1) {
                                                if (newCount < this.state.stock)
                                                    newCount += 1
                                            }
                                            else
                                                newCount += 1
                                            this.setState({
                                                productCount: newCount,
                                                productChanged: true
                                            });
                                        }}>
                                        <Text style={{ fontSize: 25 }}>+</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={{ fontSize: 18, marginTop: 20 }}>
                                    {"Total: ₹" + (this.state.item.rate * this.state.productCount)}
                                </Text>
                            </View>
                        </ScrollView>
                    </View>
                    <View
                        style={{
                            alignItems: 'center', flexDirection: 'row', marginBottom: 10
                        }}
                    >
                        <TouchableNativeFeedback onPress={this.showHomeScreen}>
                            <View style={[styles.mainButton, {
                                backgroundColor: '#00b0ff', elevation: this.state.loadingStock ? 0 : 2
                            }]}>
                                <Text style={styles.mainButtonText}>Add More Items ?</Text>
                            </View>
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback onPress={this.addProductToCart}>
                            <View style={[styles.mainButton, {
                                backgroundColor: buttonColor, elevation: this.state.loadingStock ? 0 : 2
                            }]}>
                                <Text style={styles.mainButtonText}>{buttontext}</Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                </View>
                <Modal
                    visible={this.state.loadingStock}
                    transparent={true}
                >
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <LoadingView />
                    </View>
                </Modal>
            </>
        );
    }

    getCartButtonBGColor = () => {
        if (!this.state.productAdded || this.state.productChanged)
            return '#00e676';
        else
            return '#00b0ff';
    }

    getCartButtonText = () => {
        if (!this.state.productAdded)
            return 'Add to Cart';
        if (this.state.productChanged)
            return 'Update Product'
        return 'Show Cart';
    }

    addProductToCart = () => {
        if (this.state.stock != 0) {
            if (!this.state.productAdded || this.state.productChanged) {
                this.setState({ productAdded: true, productChanged: false });
                this.props.updateProduct(this.state.item, this.state.productCount);
            }
            else {
                this.props.changeScreen('cart')
                this.props.navigation.navigate('mainScreen')
            }
        }
    }

    fetchStock = async () => {
        const res = await fetchJSON('mproduct/stock/' + this.state.item._id, null, 'GET')
        if (res != null) {
            if (res.stock !== null)
                this.setState({ stock: res.stock, loadingStock: false })
            else
                this.setState({ loadingStock: false })
        }
        else
            this.setState({ loadingStock: false })
    }

    showHomeScreen = () => {
        this.props.changeScreen('home')
        this.props.navigation.goBack()
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa'
    },
    topBar: {
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    mainButton: {
        height: 50,
        flex: 1,
        margin: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center'
    }
})

const mapStateToProps = (state) => ({
    products: state.product.products
})

const mapDispatchToProps = (dispatch) => {
    return ({
        updateProduct: (item, count) => dispatch(updateProduct(item, count)),
        changeScreen: (screen) => dispatch(changeScreen(screen))
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductScreen);