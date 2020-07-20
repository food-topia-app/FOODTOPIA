import React, { Component } from 'react'
import {
    View, TextInput, Image, TouchableOpacity, ScrollView, StyleSheet
} from 'react-native'
import { connect } from 'react-redux'

import ProductView from '../components/ProductView'

class ProductSearchScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            productsToShow: this.props.loadedProducts,
            updateFlatlist: true
        }
    }

    render() {
        return (
            <View
                style={{ flex: 1 }}
            >
                <View style={styles.topBar}>
                    <TouchableOpacity onPress={() => {
                        this.props.navigation.goBack()
                    }}>
                        <Image
                            source={require('../icons/back.png')}
                            style={{ width: 25, height: '100%', marginLeft: 10, marginRight: 10 }}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                    <TextInput
                        style={{
                            height: '100%', flex: 1, textAlignVertical: 'center', textAlign: 'center',
                            fontSize: 18, marginRight: 45
                        }}
                        placeholder='Search (English)'
                        onChangeText={this.searchTextChanged}
                    />
                </View>
                <View style={{ flex: 9 }}>
                    <ScrollView
                        contentContainerStyle={{ alignItems: 'center' }}
                    >
                        {
                            this.state.productsToShow.map(item => {
                                const base = 'data:' + item.picMime + ';base64,' + item.pic
                                return (
                                    <ProductView
                                        item={item}
                                        onPress={this.productClicked}
                                        base={base}
                                        key={item._id}
                                    />
                                )
                            })
                        }
                    </ScrollView>
                </View>
            </View>
        )
    }

    searchTextChanged = text => {
        this.setState({
            productsToShow: this.props.loadedProducts.filter(element => element.description.includes(text)),
            updateFlatlist: true
        })
    }

    productClicked = (item) => {
        this.props.navigation.navigate('productScreen', { item: item });
    }

}

const styles = StyleSheet.create({
    topBar: {
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
        backgroundColor: 'white'
    }
})

const mapStateToProps = state => ({
    loadedProducts: state.product.loadedProducts
})

export default connect(mapStateToProps)(ProductSearchScreen)