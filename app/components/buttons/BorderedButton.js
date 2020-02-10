import {Button} from "../common";
import React from "react";
import {Text, View} from "react-native";
import config from "../../../config/config";

const BorderedButton = ({onPress, title, style, rippleColor, titleStyle}) => {
    return (
        <Button
            onPress={onPress}
            style={[styles.defaultDimension, styles.container, style]}
            color={rippleColor || config().DefaultRippleColor}
        >
            <View style={[styles.titleContainer]}>
                <Text style={[styles.title, titleStyle]}>
                    {title}
                </Text>
            </View>
        </Button>
    )
};

export {BorderedButton};

const styles = {
    defaultDimension: {
        height: 40,
        width: "auto"
    },
    container: {
        backgroundColor: "transparent",
        borderColor: config().DEFAULT_BUTTON_COLOR,
        borderWidth: 1
    },
    title: {
        color: config().DEFAULT_BUTTON_COLOR
    },
    titleContainer: {
        alignItems: "center",
        justifyContent: "center",
        height: "100%"
    }
};
