import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  TouchableNativeFeedback,
  TextInput,
} from 'react-native';
import LoadingView from '../components/LoadingView';
import {connect} from 'react-redux';
import {CommonActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import QRCode from 'react-native-qrcode-svg';

import {clearProducts} from '../actions/productActions';
import {changeScreen} from '../actions/settingsActions';
import CloseIcon from '../icons/close.png';
import BackIcon from '../icons/back.png';
const Common = require('../utils/Common');

class CheckoutScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addressLoading: false,
      name: '',
      phoneNumber: '',
      address: '',
      pincode: '',
      nameError: false,
      addressError: false,
      pincodeError: false,
      orderPlacedPopup: false,
      loadingErrorPopup: false,
      orderUploading: false,
      orderUploadingError: false,
      orderUploadingErrorMsg: undefined,
      // googlePayError: false
      orderId: '',
    };
  }

  componentDidMount() {
    this.loadAddress();
  }

  render() {
    return (
      <View style={styles.container}>
        <View
          style={styles.topBar}
          opacity={this.state.popupVisible ? 0.3 : 1.0}>
          <TouchableOpacity onPress={this.backPressed}>
            <Image
              source={BackIcon}
              style={{
                width: 25,
                height: '100%',
                marginLeft: 10,
                marginRight: 10,
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={{fontSize: 17}}>Checkout</Text>
        </View>
        <View
          style={{flex: 10}}
          opacity={
            this.state.orderPlacedPopup || this.state.loadingErrorPopup
              ? 0.3
              : 1.0
          }>
          <View style={{flex: 9}}>
            <Text
              style={{
                paddingLeft: 10,
                fontSize: 20,
                marginLeft: 10,
                marginRight: 10,
                paddingTop: 10,
                flex: 1,
              }}>
              Delivery Details
            </Text>
            {!this.state.addressLoading && (
              <View style={{flex: 7, marginLeft: 30}}>
                <View
                  style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
                  <Text style={{fontSize: 18, flex: 2}}>Name: </Text>
                  <TextInput
                    onChangeText={text => {
                      this.state.name = text;
                    }}
                    defaultValue={this.state.name}
                    style={{
                      flex: 4,
                      borderWidth: 1,
                      borderRadius: 10,
                      padding: 10,
                      marginRight: 20,
                      marginBottom: 10,
                      borderColor: this.state.nameError ? '#e53935' : '#64b5f6',
                      marginTop: 10,
                      marginLeft: 5,
                    }}
                    placeholder="Name"
                  />
                </View>
                <View
                  style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
                  <Text style={{fontSize: 18, flex: 2}}>
                    Admission No. (or ID):
                  </Text>
                  <TextInput
                    onChangeText={text => {
                      this.state.address = text;
                    }}
                    defaultValue={this.state.address}
                    style={{
                      flex: 4,
                      borderWidth: 1,
                      borderRadius: 10,
                      padding: 10,
                      marginRight: 20,
                      marginBottom: 10,
                      borderColor: this.state.addressError
                        ? '#e53935'
                        : '#64b5f6',
                      marginTop: 10,
                      marginLeft: 5,
                    }}
                    placeholder="Admission No. (or ID)"
                  />
                </View>
                <View
                  style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
                  <Text style={{fontSize: 18, flex: 2}}>Dept.: </Text>
                  <TextInput
                    onChangeText={text => {
                      this.state.pincode = text;
                    }}
                    defaultValue={this.state.pincode}
                    style={{
                      flex: 4,
                      borderWidth: 1,
                      borderRadius: 10,
                      padding: 10,
                      marginRight: 20,
                      marginBottom: 10,
                      borderColor: this.state.pincodeError
                        ? '#e53935'
                        : '#64b5f6',
                      marginTop: 10,
                      marginLeft: 5,
                    }}
                    placeholder="Dept."
                  />
                </View>
                <View
                  style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
                  <Text style={{fontSize: 18, flex: 1}}>Phone: </Text>
                  <Text style={{fontSize: 18, flex: 3}}>
                    {this.state.phoneNumber}
                  </Text>
                </View>
              </View>
            )}
            {this.state.addressLoading && (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 6,
                }}>
                <LoadingView />
              </View>
            )}
            <Text
              style={{
                fontSize: 25,
                marginTop: 20,
                flex: 1,
                alignSelf: 'center',
                borderTopWidth: 1,
                borderTopColor: 'gray',
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 10,
              }}>
              {'Total Amount to Pay: ₹' + this.props.route.params.totalAmount}
            </Text>
            <Text
              style={{
                marginLeft: 10,
                marginRight: 10,
                alignSelf: 'center',
                flex: 1,
                paddingLeft: 10,
                paddingRight: 10,
                width: '90%',
                textAlign: 'center',
              }}>
              (All orders are CASH ON DELIVERY)
            </Text>
          </View>
          <View style={{flex: 1, alignItems: 'center', marginBottom: 5}}>
            <TouchableNativeFeedback onPress={this.placeOrderPressed}>
              <View
                style={{
                  height: '90%',
                  width: '90%',
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#00e676',
                  elevation:
                    this.state.orderPlacedPopup || this.state.loadingErrorPopup
                      ? 0
                      : 2,
                }}>
                <Text
                  style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>
                  Place Order
                </Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
        <Modal
          visible={this.state.orderPlacedPopup}
          transparent={true}
          animationType={'fade'}>
          <View
            style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
            <View
              style={{
                alignItems: 'center',
                width: '70%',
                height: !(
                  this.state.orderUploadingError || this.state.orderUploading
                )
                  ? '50%'
                  : '30%',
                elevation: 5,
                borderRadius: 10,
                backgroundColor: 'white',
                padding: 10,
                justifyContent: this.state.orderUploadingError
                  ? 'flex-start'
                  : 'center',
              }}>
              <View style={{alignSelf: 'flex-end'}}>
                {this.state.orderUploadingError && (
                  <TouchableOpacity onPress={this.dismissOrderErrorPopup}>
                    <Image
                      source={CloseIcon}
                      resizeMode="contain"
                      style={{width: 30, height: 30}}
                    />
                  </TouchableOpacity>
                )}
              </View>
              {this.state.orderUploadingError && (
                <View style={{alignItems: 'center'}}>
                  <Text style={styles.errorMessageText}>
                    {this.getOrderErrorMsg()}
                  </Text>
                  <TouchableOpacity
                    style={{justifyContent: 'center'}}
                    onPress={this.placeOrderPressed}>
                    <Text style={styles.errorMessageButton}>Try Again?</Text>
                  </TouchableOpacity>
                </View>
              )}
              {this.state.orderUploading && (
                <View style={{alignItems: 'center'}}>
                  <Text style={styles.errorMessageText}>
                    Placing order. Please wait!
                  </Text>
                  <LoadingView />
                </View>
              )}
              {!(
                this.state.orderUploadingError || this.state.orderUploading
              ) && (
                <View style={{alignItems: 'center'}}>
                  <Text style={styles.errorMessageText}>Order Placed :)</Text>
                  <QRCode value={this.state.orderId} size={200} />
                  <TouchableOpacity
                    style={{justifyContent: 'center'}}
                    onPress={this.dismissOrderPlacedPopup}>
                    <Text style={styles.errorMessageButton}>Okay</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>
        <Modal
          visible={this.state.loadingErrorPopup}
          transparent={true}
          animationType={'fade'}>
          <View
            style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: '70%',
                height: '30%',
                elevation: 5,
                borderRadius: 10,
                borderWidth: 2,
                backgroundColor: 'white',
                borderColor: 'white',
              }}>
              <Text
                style={{flex: 1, textAlignVertical: 'bottom', fontSize: 14}}>
                Server Unreachable! Try again?
              </Text>
              <TouchableOpacity
                style={{flex: 1, justifyContent: 'center'}}
                onPress={this.loadAddress}>
                <Text
                  style={{color: '#1e88e5', fontSize: 14, fontWeight: 'bold'}}>
                  Okay
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  backPressed = () => {
    this.props.navigation.goBack();
  };

  placeOrderPressed = async () => {
    const {name, address, pincode, phoneNumber} = this.state;

    const nameError = name.length === 0;
    const addressError = address.length === 0;
    const pincodeError = pincode.length === 0;
    const phoneNumberError = phoneNumber.length === 0;

    this.setState({
      nameError: nameError,
      addressError: addressError,
      pincodeError: pincodeError,
      orderPlacedPopup: !(
        nameError ||
        addressError ||
        pincodeError ||
        phoneNumberError
      ),
      orderUploading: !(
        nameError ||
        addressError ||
        pincodeError ||
        phoneNumberError
      ),
      orderUploadingError: false,
    });

    if (!(nameError || addressError || pincodeError || phoneNumberError)) {
      let branchId = await AsyncStorage.getItem('branchId');
      let responseJSON = await Common.fetchJSON('morder', {
        name: name,
        address: address,
        pincode: pincode,
        amount: this.props.route.params.totalAmount,
        items: this.cleanProducts(this.props.products),
        date: this.getDate(),
        time: this.getTime(),
        branchId: branchId,
      });
      if (responseJSON != null) {
        const {msg, name, id} = responseJSON;
        if (msg)
          this.setState({
            orderUploading: false,
            orderUploadingError: true,
            orderUploadingErrorMsg:
              name + ' is out of stock. Remove this item and try again!',
          });
        else {
          this.setState({
            orderUploading: false,
            orderId: id,
          });
        }
      } else this.setState({orderUploading: false, orderUploadingError: true});
    }
  };

  loadAddress = async () => {
    this.setState({addressLoading: true, loadingErrorPopup: false});
    let user = await Common.fetchJSON('mauth', {}, 'GET');
    if (user != null) {
      if (!user.name) user.name = '';
      if (!user.address) user.address = '';
      if (!user.pincode) user.pincode = '';
      this.setState({
        addressLoading: false,
        phoneNumber: user.phoneNumber,
        name: user.name,
        address: user.address,
        pincode: user.pincode,
      });
    } else this.setState({addressLoading: false, loadingErrorPopup: true});
  };

  dismissOrderPlacedPopup = () => {
    this.setState({orderPlacedPopup: false});
    this.props.clearProducts();
    this.props.changeScreen('home');
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{name: 'mainScreen'}],
    });
    this.props.navigation.dispatch(resetAction);
  };

  getDate = () => {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (day < 10) day = '0' + day;
    if (month < 10) month = '0' + month;
    return day + '-' + month + '-' + year;
  };

  getTime = () => {
    let date = new Date();
    let A = 'AM';
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    if (hour == 0) hour = 12;
    else if (hour > 12) {
      hour -= 12;
      A = 'PM';
    }
    return hour + ':' + minute + ':' + second + ' ' + A;
  };

  cleanProducts = products => {
    let cleanedProducts = [];
    products.some(oldElement => {
      let element = JSON.parse(JSON.stringify(oldElement));
      // delete element.item._id;
      delete element.item.branch;
      delete element.item.description;
      delete element.item.__v;
      // delete element.item.pic;
      // delete element.item.picMime;
      cleanedProducts.push(element);
    });
    return cleanedProducts;
  };

  getOrderErrorMsg = () => {
    if (this.state.orderUploadingErrorMsg)
      return this.state.orderUploadingErrorMsg;
    else return 'Unable to place order. Check network and try again.';
  };

  dismissOrderErrorPopup = () => {
    this.setState({
      orderPlacedPopup: false,
      loadingErrorPopup: false,
      orderUploading: false,
      orderUploadingError: false,
      orderUploadingErrorMsg: undefined,
    });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  topBar: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    backgroundColor: 'white',
  },
  errorMessageText: {
    textAlignVertical: 'bottom',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  errorMessageButton: {
    color: '#1e88e5',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

const mapStateToProps = state => {
  return {
    products: state.product.products,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    clearProducts: () => dispatch(clearProducts()),
    changeScreen: screen => dispatch(changeScreen(screen)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CheckoutScreen);
