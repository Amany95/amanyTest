import React from "react";
import {Text, View, Dimensions} from "react-native";
import PropTypes from "prop-types";
import {CachedImage} from "react-native-img-cache";

import {Button} from "../common";
import {getDefaultLanguageText} from "../../translation/translate";
import Normalize from "../../utils/Normalize";

const {width} = Dimensions.get("window");

const OfferListItem = ({offer, onPress}) => {
    return (
        <View style={styles.cardContainer}>
            <Button onPress={onPress}>
                <View>
                    <CachedImage style={styles.imageStyle} source={{uri: offer.image}}/>
                    <View style={styles.textContainer}>
                        <Text numberOfLines={2} style={styles.titleStyle}>{getDefaultLanguageText(offer.title)}</Text>
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
        justifyContent: "center"
    },
    imageStyle: {
        width: width / 2 - 14,
        height: (width / 2 - 14) / 1.78,
        resizeMode: "cover"
    }
};

OfferListItem.propTypes = {
    offer: PropTypes.instanceOf(Object),
    onPress: PropTypes.func
};

export {OfferListItem};


