import React, { Component } from 'react';
import { View, Animated, StyleSheet, Text } from 'react-native';

class LoadingView extends Component {

    constructor(props){
        super(props);
        if(props.color != null)
            this.state.color = props.color;
    }

    state = {
        c1: new Animated.Value(0.5),
        c2: new Animated.Value(0.5),
        c3: new Animated.Value(0.5),
        color: 'gray'
    }

    componentDidMount() {
        Animated.loop(
            Animated.parallel([
                Animated.sequence([
                    Animated.timing(this.state.c1, { toValue: 1, duration: 200, useNativeDriver: true, delay: 0 }),
                    Animated.timing(this.state.c1, { toValue: 0, duration: 200, useNativeDriver: true, delay: 0 }
                    )]),
                Animated.sequence([
                    Animated.timing(this.state.c2, { toValue: 1, duration: 200, useNativeDriver: true, delay: 100 }),
                    Animated.timing(this.state.c2, { toValue: 0, duration: 200, useNativeDriver: true, delay: 0 })
                ]),
                Animated.sequence([
                    Animated.timing(this.state.c3, { toValue: 1, duration: 200, useNativeDriver: true, delay: 300 }),
                    Animated.timing(this.state.c3, { toValue: 0, duration: 200, useNativeDriver: true, delay: 0 })
                ])
            ])
        ).start();
    }

    render() {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'center', margin: 10 }}>
                <Animated.View style={[styles.circle, { backgroundColor: this.state.color },
                { transform: [{ translateY: this.state.c1.interpolate({ inputRange: [0, 1], outputRange: [7, -7] }) }] }]} />
                <Animated.View style={[styles.circle, { backgroundColor: this.state.color },
                { transform: [{ translateY: this.state.c2.interpolate({ inputRange: [0, 1], outputRange: [7, -7] }) }] }]} />
                <Animated.View style={[styles.circle, { backgroundColor: this.state.color },
                { transform: [{ translateY: this.state.c3.interpolate({ inputRange: [0, 1], outputRange: [7, -7] }) }] }]} />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    circle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        margin: 5
    }
})

export default LoadingView;