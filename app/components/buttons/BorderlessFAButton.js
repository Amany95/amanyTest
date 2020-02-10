import {Button} from "../common";
import React from "react";
import {Text, View} from "react-native";
import config from "../../../config/config";

const BorderlessFAButton = ({onPress, style, rippleColor, children}) => {

    return (
        <Button
            onPress={onPress}
            style={[styles.defaultDimension, styles.container, style]}
            color={rippleColor || config().DefaultRippleColor}
        >
            <View style={[styles.defaultDimension, styles.titleContainer]}>
                {children}
            </View>
        </Button>
    )
};

export {BorderlessFAButton};

const styles = {
    defaultDimension: {
        height: 64,
        width: 64,
        borderRadius: 64,
    },

    container: {
        backgroundColor: config().DEFAULT_BUTTON_COLOR,
        elevation: 3,
        shadowOpacity: 0.5,
        shadowColor: '#000',
    },
    titleContainer: {
        alignItems: 'center',
        justifyContent: 'center'

    }
};