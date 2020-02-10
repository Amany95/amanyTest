import React from "react";
import {Dimensions, Text, TouchableOpacity, View} from "react-native";
import {CachedImage} from "react-native-img-cache";
import {Card} from "../common";
import {getDefaultLanguageText} from "../../translation/translate";

const {width} = Dimensions.get("window");

export const MagazineItem = ({magazine, onPress}) => {
    const {image, title} = magazine;

    return (
        <Card style={styles.cardContainer}>
            <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
                <CachedImage style={styles.imageStyle} source={{uri: image}}/>
                <View style={styles.textContainer}>
                    <Text numberOfLines={2} style={styles.titleStyle}>{getDefaultLanguageText(title)}</Text>
                </View>
            </TouchableOpacity>
        </Card>
    )
};

const styles = {
    cardContainer: {
        margin: 5,
        width: width / 2 - 10,
        backgroundColor: "#ddd"
    },
    titleStyle: {
        textAlign: "center",
        height: 50,
        color: "#000"
    },
    textContainer: {
        padding: 15,
        justifyContent: "center",
        alignItems: "center"
    },
    imageStyle: {
        height: 240,
        width: "100%",
        resizeMode: "cover"
    }
};


