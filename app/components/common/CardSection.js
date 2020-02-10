import React from 'react';
import {View} from 'react-native';

const CardSection = (props) => {
    return (
        <View style={[styles.containerStyle, props.style]}>
            {props.children}
        </View>
    );
};

const styles = {
    containerStyle: {
        flex: 1,
        flexDirection: 'row',
        position: 'relative'
    }
};

export default CardSection;