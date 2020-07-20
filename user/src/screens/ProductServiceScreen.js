import React, { Component } from 'react'
import {
    View, Text, StyleSheet, Image, Modal,
    TouchableOpacity, FlatList
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import LoadingView from '../components/LoadingView'
import ProductView from '../components/ProductView'
import { connect } from 'react-redux'

import { addLoadedProducts } from '../actions/productActions'
import { changeLocation } from '../actions/settingsActions'

import SearchIcon from '../icons/search.png'
const Common = require('../utils/Common')

class ProductServiceScreen extends Component {

    state = {
        products: [],
        loading: true,
        loadingError: false,
        updateProducts: false,
        reLogin: false,
        refetchProducts: false
    }

    componentDidMount() {
        this.loadAllData()
    }

    componentDidUpdate(prevProps) {
        const { branchId } = this.props
        if (prevProps.branchId !== branchId) {
            this.setState({
                loading: true,
                products: []
            });
            if (this.state.refetchProducts)
                this.fetchProducts();
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View
                    style={styles.topBar}
                    opacity={(this.state.loadingError || this.state.branchError) ? 0.3 : 1.0}
                >
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => { this.props.navigation.navigate('locationScreen'); }}
                    >
                        <Text style={{ padding: 10, color: '#25b7d3' }}>{this.props.branchName}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.searchPressed}
                    >
                        <Image
                            style={styles.iconStyle}
                            source={SearchIcon}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                </View>
                <View
                    style={styles.contents}
                    opacity={(this.state.loadingError || this.state.branchError) ? 0.3 : 1.0}
                >
                    {
                        this.state.loading ? (
                            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                <LoadingView />
                            </View>) : (
                                this.state.products.length > 0 ? (
                                    <FlatList
                                        data={this.state.products}
                                        renderItem={this.renderProducts}
                                        keyExtractor={item => item._id}
                                        contentContainerStyle={{alignItems: 'center'}}
                                    />
                                ) : (
                                        <View
                                            style={{
                                                alignItems: 'center', justifyContent: 'center', flex: 1
                                            }}
                                        >
                                            <Text style={{ fontSize: 17 }}>No Products Available</Text>
                                        </View>
                                    )
                            )
                    }
                </View>
                <Modal
                    visible={this.state.loadingError}
                    transparent={true}
                    animationType={"fade"}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                        <View style={{
                            alignItems: 'center', justifyContent: 'center', width: '70%', height: '30%', elevation: 5,
                            borderRadius: 10, borderWidth: 2, backgroundColor: 'white', borderColor: 'white'
                        }}>
                            <Text style={{ flex: 1, textAlignVertical: 'bottom', fontSize: 14 }}>
                                {this.state.reLogin ? 'Please login again to continue.' : 'Server unreachable! Try again.'}
                            </Text>
                            <TouchableOpacity style={{ flex: 1, justifyContent: 'center' }} onPress={() => {
                                if (this.state.reLogin) {
                                    Common.logout(this.props.navigation);
                                }
                                else {
                                    this.setState({ loading: true, loadingError: false });
                                    this.fetchProducts();
                                }
                            }}>
                                <Text style={{ color: '#1e88e5', fontSize: 14, fontWeight: 'bold' }}>
                                    {this.state.reLogin ? 'Okay' : 'Try again?'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }

    renderProducts = ({ item }) => (
        <ProductView
            base={'data:' + item.picMime + ';base64,' + item.pic}
            item={item}
            onPress={this.productPressed}
        />)

    productPressed = (item) => {
        this.props.navigation.navigate('productScreen', { item: item });
    }

    getSelectedBranch = async () => {
        let selectedBranch = await AsyncStorage.getItem('branchName')
        let selectedBranchId = await AsyncStorage.getItem('branchId')
        if (selectedBranch != null)
            return { selectedBranch, selectedBranchId }
        else
            return null
    }

    fetchProducts = async () => {
        let tmpFcmToken = await AsyncStorage.getItem('fcmToken');
        let updateFcmToken = tmpFcmToken == null;
        if (updateFcmToken) {
            await AsyncStorage.setItem('fcmToken', this.props.fcmToken);
        }

        let responseJSON = await Common.fetchJSON('mproduct', {
            branchId: this.props.branchId,
            updateFcmToken: updateFcmToken,
            fcmToken: updateFcmToken ? this.props.fcmToken : ''
        });
        if (responseJSON === 'INVALID_USER') {
            this.setState({ loading: false, loadingError: true, reLogin: true });
        }
        else if (responseJSON != null) {
            let products = []
            responseJSON.forEach(element => {
                this.props.addLoadedProducts(element);
                if (this.props.branchId === element.branch) {
                    products.push(element);
                }
            });
            this.setState({ loading: false, loadingError: false, products });
        }
        else
            this.setState({ loading: false, loadingError: true });
    }

    loadAllData = async () => {
        branchData = await this.getSelectedBranch();
        if (branchData != null) {
            this.props.changeLocation(branchData.selectedBranch, branchData.selectedBranchId)
            const { loadedProducts } = this.props
            if (loadedProducts.length > 0) {
                let products = []
                loadedProducts.some(element => {
                    if (branchData.selectedBranchId === element.branch) {
                        products.push(element)
                    }
                })
                this.setState({ products: products, loading: false, refetchProducts: true })
            }
            else
                this.fetchProducts()
        }
        else {
            this.state.refetchProducts = true
            this.props.navigation.navigate('locationScreen')
        }
    }

    searchPressed = () => {
        this.props.navigation.navigate('productSearchScreen')
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa'
    },
    contents: {
        width: '100%',
        flex: 10,
        backgroundColor: 'white'
    },
    topBar: {
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    iconStyle: {
        width: 30,
        height: '100%',
        marginRight: 10,
        marginLeft: 10
    },
    subHeading: {
        fontWeight: 'bold',
        margin: 15,
        flex: 1,
        fontSize: 20,
        color: '#393e46'
    },
    showAllText: {
        height: '100%',
        textAlignVertical: 'center',
        padding: 5,
        color: '#1e88e5'
    },
    showAllButton: {
        alignSelf: 'center',
        height: '60%',
        marginRight: 15,
    }
})

const mapStateToProps = (state) => ({
    loadedProducts: state.product.loadedProducts,
    fcmToken: state.settings.fcmToken,
    branchName: state.settings.branchName,
    branchId: state.settings.branchId
})

const mapDispatchToProps = (dispatch) => ({
    addLoadedProducts: (loadedProducts) => dispatch(addLoadedProducts(loadedProducts)),
    changeLocation: (branchName, branchId) => dispatch(changeLocation(branchName, branchId))
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductServiceScreen);