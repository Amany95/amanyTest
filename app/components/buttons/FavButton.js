import React from "react";
import {Button} from "../common";
import {CachedImage} from "react-native-img-cache";

const FavButton = ({fav, onPress, buttonStyle, iconStyle}) => {
    return (
        <Button
            onPress={onPress}
            style={[styles.container, buttonStyle]}>
            {fav ?
                <CachedImage source={require('../../../assets/icons/fav-del.png')} resizeMode={'contain'} style={[styles.favImage, iconStyle]}/> :
                <CachedImage source={require('../../../assets/icons/fav.png')} resizeMode={'contain'} style={[styles.favImage, iconStyle]}/>
            }
        </Button>
    )
};

export {FavButton};

const styles = {
    container: {
        margin: 3
    },
    favImage: {
        width: 24,
        height: 24
    }
};