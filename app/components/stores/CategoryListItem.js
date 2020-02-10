import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import {getDefaultLanguageText} from "../../translation/translate";
import {Card} from "../common";

const CategoryListItem = ({item, onPress}) => {

    return (
        <Card>
            <TouchableOpacity onPress={onPress} style={styles.container}>
                <View style={styles.buttonStyle}>
                    <Text style={styles.textStyle}>{getDefaultLanguageText(item["name"])}</Text>
                </View>
            </TouchableOpacity>
        </Card>
    )
};

const styles = {
    container: {
        padding: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor:"#ccc"
    },
    buttonStyle: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    textStyle: {
        fontSize: 16
    },
    leftArrow: {
        fontSize: 25,
        color: "#999"
    }
};

export default CategoryListItem;
