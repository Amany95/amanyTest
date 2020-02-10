import React from "react";
import {Text, View, Dimensions} from "react-native";
import {CachedImage} from "react-native-img-cache";
import PropTypes from "prop-types";

import {Button} from "../common";
import {getDefaultLanguageText} from "../../translation/translate";

const {width} = Dimensions.get("window");

const NewListItem = ({item, onPress}) => {
    return (
        <View style={styles.cardContainer}>
            <Button onPress={onPress}>
                <View>
                    <CachedImage style={styles.imageStyle} source={{uri: item.image}}/>
                    <View style={styles.textContainer}>
                        <Text numberOfLines={2}
                              œstyle={styles.titleStyle}>
                            {getDefaultLanguageText(item.title)}
                        </Text>
                    </View>
                </View>
            </Button>
        </View>
    );
};

const styles = {
    cardContainer: {
        backgroundColor: "#ffffff",
        margin: 5
    },
    titleStyle: {
        textAlign: "center",
        fontSize: 15
    },
    textContainer: {
        padding: 15,
        justifyContent: "center",
        alignItems: "center"
    },
    imageStyle: {
        width: width / 2 - 14,
        height: (width / 2 - 14) / 1.78,
        resizeMode: "contain"
    }
};

NewListItem.propTypes = {
    item: PropTypes.instanceOf(Object),
    onPress: PropTypes.func
};

export {NewListItem};


