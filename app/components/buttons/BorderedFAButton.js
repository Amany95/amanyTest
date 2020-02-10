import {Button} from "../common";
import React from "react";
import {Text, View} from "react-native";
import config from "../../../config/config";

const BorderedFAButton = ({onPress, style, rippleColor, children}) => {

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

export {BorderedFAButton};

const styles = {
    defaultDimension: {
        height: 64,
        width: 64,
        borderRadius: 64,
    },
    container: {
        borderWidth: 1,
        borderColor: config().DEFAULT_BUTTON_COLOR,
        shadowOpacity: 0.5,
        shadowColor: '#000',
    },
    titleContainer: {
        alignItems: 'center',
        justifyContent: 'center'

    }
};