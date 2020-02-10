import React from "react";
import {TextInput, View} from "react-native";

const Input = (props) => {
    const {inputStyle, containerStyle, error} = styles;

    return (
        <View>
            <View style={[containerStyle, props.style]}>
                <TextInput
                    {...props}
                    style={inputStyle}
                    placeholderTextColor="#6b6b6b"
                    underlineColorAndroid='rgba(0,0,0,0)'
                    autoCorrect={false}
                />
                {props.error && <View style={error}/>}
            </View>
        </View>
    );
};

const styles = {
    inputStyle: {
        color: "#000",
        marginRight: 10,
        marginLeft: 10,
        fontSize: 15,
        height: 40,
        width: "100%",
        borderWidth: 0
    },
    containerStyle: {
        justifyContent: "center"
    },
    error: {
        width: "100%",
        height: 1,
        marginBottom: 2,
        backgroundColor: "red"
    }
};

export {Input};

