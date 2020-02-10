import React from 'react';
import {View} from 'react-native';

const Card = ({style, children, tabLabel, key}) => {
    return (
        <View style={[styles.containerStyle, style]} tabLabel={tabLabel} key>
            {children}
        </View>
    );
};

const styles = {
    containerStyle: {
        flex: 1
    }
};

export {Card};