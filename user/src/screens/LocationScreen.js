import React, { Component } from 'react';
import {
    View, Text, StyleSheet, Image, FlatList, Dimensions,
    TouchableOpacity, Modal, BackHandler
} from 'react-native';
import LoadingView from '../components/LoadingView';
import ClickableCardView from '../components/ClickableCardView';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux'

import { changeLocation } from '../actions/settingsActions'

const Common = require('../utils/Common');
const dimension = Dimensions.get('window');
const widthGlobal = dimension.width;
const heightGlobal = dimension.height;

class LocationScreen extends Component {

    componentDidMount() {
        this.fetchLocations();
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        this.backHandler.remove()
    }

    state = {
        isBranchesLoaded: false,
        branches: [],
        selectedBranchID: null,
        selectedBranchName: '',
        refreshFlatList: false,
        popupVisible: false,
        popupText: ''
    }

    render() {
        return (
            <View style={styles.container}>
                <View
                    style={styles.topBar}
                    opacity={this.state.popupVisible ? 0.3 : 1.0}
                >
                    <Text style={{ fontSize: 17, flex: 1, marginLeft: 20 }}>Select Branch</Text>
                    <View
                        style={{
                            justifyContent: 'flex-end', alignItems: 'center', flex: 1, flexDirection: 'row'
                        }}
                    >
                        <TouchableOpacity
                            style={{ marginRight: 10 }}
                            onPress={this.saveBranch}
                        >
                            <View style={{
                                alignItems: 'center', justifyContent: 'center', width: 50, height: 30,
                                borderColor: '#25b7d3', borderRadius: 2, borderWidth: 1
                            }}>
                                <Text style={{ color: '#25b7d3', fontWeight: 'bold' }}>Save</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.contents} opacity={this.state.popupVisible ? 0.3 : 1.0}>
                    {
                        this.state.isBranchesLoaded &&
                        <FlatList
                            data={this.state.branches}
                            renderItem={this.renderItem}
                            keyExtractor={item => item._id}
                            contentContainerStyle={{ alignItems: 'center' }}
                            extraData={this.state.refreshFlatList}
                        />
                    }
                    {
                        !this.state.isBranchesLoaded &&
                        <View style={{ justifyContent: 'center', flex: 1 }}>
                            <LoadingView />
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
                            borderColor: 'white'
                        }}>
                            <Text style={{ flex: 1, textAlignVertical: 'bottom', fontSize: 14 }}>
                                {this.state.popupText}
                            </Text>
                            <TouchableOpacity
                                style={{ flex: 1, justifyContent: 'center' }}
                                onPress={this.popupDismiss}>
                                <Text style={{ color: '#1e88e5', fontSize: 14, fontWeight: 'bold' }}>
                                    Okay
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }

    renderItem = ({ item }) => {
        let selected = this.state.selectedBranchID === item._id;
        return (
            <ClickableCardView
                onPress={this.branchSelected}
                value={item}
                width={widthGlobal * 0.8}
                height={heightGlobal * 0.3}
                borderColor={selected ? '#25b7d3' : 'gray'}
                borderWidth={selected ? 2 : 1}
            />
        );
    }

    fetchLocations = async () => {
        let responseJSON = await Common.fetchJSON('mbranch', {}, 'GET');
        if (responseJSON == null)
            this.setState({ popupVisible: true, popupText: 'Server Unreachable, Try again.', isBranchesLoaded: true });
        else
            this.setState({ branches: responseJSON, isBranchesLoaded: true });
    }

    branchSelected = (value) => {
        this.setState({ selectedBranchID: value._id, selectedBranchName: value.name, refreshFlatList: true });
    }

    saveBranch = async () => {
        if (this.state.selectedBranchID == null)
            this.setState({ popupVisible: true, popupText: 'Select a branch first!' });
        else {
            await AsyncStorage.setItem('branchId', this.state.selectedBranchID);
            await AsyncStorage.setItem('branchName', this.state.selectedBranchName);
            this.props.changeLocation(this.state.selectedBranchName, this.state.selectedBranchID);
            this.props.navigation.goBack();
        }
    }

    popupDismiss = () => {
        this.setState({ popupVisible: false });
    }

    handleBackPress = () => {
        return true;
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
    },
    topBar: {
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
        backgroundColor: 'white'
    }
})

const mapDispatchToProps = (dispatch) => {
    return ({
        changeLocation: (branchName, branchId) => dispatch(changeLocation(branchName, branchId))
    })
}

export default connect(null, mapDispatchToProps)(LocationScreen);