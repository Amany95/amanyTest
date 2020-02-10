import {Button} from "../common";
import React from "react";
import {Text, View} from "react-native";
import config from "../../../config/config";

const DefaultButton = ({onPress, title, style, rippleColor, titleStyle}) => {
    return (
        <Button
            onPress={onPress}
            style={[styles.defaultDimension, styles.container, style]}
            color={rippleColor || config().DefaultRippleColor}
        >
            <View style={[styles.defaultDimension, styles.titleContainer, style]}>
                <Text style={[styles.title, titleStyle]}>
                    {title}
                </Text>
            </View>
        </Button>
    )
};

export {DefaultButton};

const styles = {
    defaultDimension: {
        height: 40,
        width: 'auto',
        minWidth: 100
    },
    container: {
        backgroundColor: '#fff',
    },
    title: {
        color: config().DEFAULT_BUTTON_COLOR,
    },
    titleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    }
};