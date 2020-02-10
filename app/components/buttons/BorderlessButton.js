import {Button} from "../common";
import React from "react";
import {Text, View} from "react-native";
import config from "../../../config/config";

const BorderlessButton = ({onPress, title, style, rippleColor, titleStyle}) => {
    return (
        <Button
            onPress={onPress}
            style={[styles.defaultDimension, styles.container, style]}
            color={rippleColor || config().DefaultRippleColor}
        >
            <View style={[styles.defaultDimension, styles.titleContainer]}>
                <Text style={[styles.title, titleStyle]}>
                    {title}
                </Text>
            </View>
        </Button>
    )
};

export {BorderlessButton};

const styles = {
    defaultDimension: {
        height: 40,
        width: 'auto',
        minWidth: 100
    },
    container: {
        backgroundColor: config().DEFAULT_BUTTON_COLOR,
    },
    title: {
        color: '#fff',
    },
    titleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    }
};