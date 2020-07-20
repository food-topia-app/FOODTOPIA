import React, { Component } from 'react';
import { TouchableWithoutFeedback, Text, View } from 'react-native';

class ClickableCardView extends Component {

    state = {
        updateComponent: 0
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={this.onClick}>
                <View
                    style={{
                        width: this.props.width, height: this.props.height, margin: 10, alignItems: 'center',
                        justifyContent: 'space-evenly', borderWidth: this.props.borderWidth, borderColor: this.props.borderColor,
                        elevation: 0, borderRadius: 5, backgroundColor: 'white'
                    }}>
                    <Text style={{fontSize: 17, fontWeight: 'bold'}}>{this.props.value.name}</Text>
                    <Text style={{fontSize: 17}}>{this.props.value.location}</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    onClick = () => {
        this.state.updateComponent = 2;
        this.props.onPress(this.props.value);
    }

    shouldComponentUpdate() {
        if (this.state.updateComponent > 0) {
            this.state.updateComponent--;
            return true;
        }
        return false;
    }
}

export default ClickableCardView;