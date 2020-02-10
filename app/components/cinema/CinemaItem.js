import React from "react";
import {Dimensions, Text, TouchableOpacity, View} from "react-native";
import {CachedImage} from "react-native-img-cache";
import {Card} from "../common";
import {getDefaultLanguageText} from "../../translation/translate";


const {width} = Dimensions.get("window");

export const CinemaItem = ({cinema, onPress}) => {
    const {poster, title} = cinema.item;

    return (
        <Card style={styles.cardContainer}>
            <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
                <CachedImage style={styles.imageStyle} source={{uri: poster}}/>
                <View style={styles.textContainer}>
                    <Text style={styles.titleStyle}>{getDefaultLanguageText(title)}</Text>
                </View>
            </TouchableOpacity>
        </Card>
    )
};

const styles = {
    cardContainer: {
        margin: 5,
        width: width / 2 - 10,
        backgroundColor: "#ccc"
    },
    titleStyle: {
        textAlign: "center",
        color: "#000"
    },
    textContainer: {
        padding: 15,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    imageStyle: {
        height: 240,
        width: "100%",
        resizeMode: "cover"
    },
};


