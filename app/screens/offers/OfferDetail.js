import React from "react";
import {StyleSheet, Text, TouchableOpacity, Dimensions, View} from "react-native";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {CachedImage} from "react-native-img-cache";

import {favoriteAction} from "../../actions/Favorite";
import {getDefaultLanguageText, translateText} from "../../translation/translate";
import {shareData} from "../../actions/Main";
import {FavButton} from "../../components/buttons";
import AutoHeightWebView from "../../components/common/AutoHeightWebView";
import config from "../../../config/config";

const {width} = Dimensions.get("window");

class OfferDetail extends React.Component {
    static navigationOptions = ({navigation}) => {
        const {state} = navigation;
        return {
            title: `${getDefaultLanguageText(state.params.title)}`.toUpperCase()
        };
    };

    render() {
        const {offer} = this.props.navigation.state.params;

        return (
            <View style={{flex: 1, backgroundColor: "#fff"}}>
                <View style={styles.container}>
                    <CachedImage source={{uri: offer.image}} style={styles.image}/>
                    <View style={styles.shareAndLikeContainer}>
                        <FavButton
                            fav={offer.fav}
                            onPress={() => {
                                this.props.favoriteAction({
                                    userid: offer["userid"],
                                    isFav: offer["fav"],
                                    item_id: offer["_id"],
                                    item_type: "favorite_offers"
                                });
                            }}/>

                        <Text style={styles.button} onPress={() => {
                            let shareOptions = {
                                title: getDefaultLanguageText(offer.title),
                                message: getDefaultLanguageText(offer.title),
                                url: offer.image,
                                subject: getDefaultLanguageText(offer.title),
                                type: "image/jpeg"
                            };

                            this.props.shareData(shareOptions);
                        }}>{translateText("Share").toUpperCase()}</Text>
                    </View>
                    <Text style={styles.title}>{getDefaultLanguageText(offer.title)}</Text>
                    <Text style={styles.subtitle}>{getDefaultLanguageText(offer.subtitle)}</Text>
                    <AutoHeightWebView
                        navigation={this.props.navigation}
                        defaultUrl={offer.explanation}
                        autoHeight={true}
                    />
                </View>
                {offer.store && <TouchableOpacity
                    style={styles.favButton}
                    activeOpacity={1} onPress={() => {
                    this.props.navigation.navigate("StoreDetail", {data: offer.store, title: offer.store.name});
                }}>
                    <CachedImage style={{width: 18, height: 18}}
                                 source={require("../../../assets/icons/directory.png")}/>

                </TouchableOpacity>}
            </View>
        );
    }
}

const styles = {
    shareAndLikeContainer: {
        paddingRight: 15,
        paddingLeft: 15,
        height: 48,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        borderBottomWidth: 1,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: "#ccc",
        backgroundColor: "#fff",
        marginBottom: 10
    },
    imageStyle: {
        width: "100%",
        height: 130,
        resizeMode: "cover"
    },
    dateText: {
        fontSize: 15,
        color: "#787878"
    },
    container: {
        flex: 1
    },
    likeButtonContainer: {
        position: "absolute",
        right: 0,
        zIndex: 1,
        margin: 15
    },
    image: {
        resizeMode: "cover",
        width,
        height: width / 1.78
    },
    button: {
        fontSize: 16,
        padding: 5,
        color: config().BASE_SECOND_COLOR
    },
    buttonGroup: {
        flexDirection: "row"
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        width: "100%",
        paddingLeft: 15,
        paddingRight: 15
    },
    subtitle: {
        fontSize: 16,
        fontWeight: "600",
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 30
    },
    explanation: {
        fontSize: 13,
        marginTop: 10
    },
    favButton: {
        position: "absolute",
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: config().BASE_COLOR,
        right: 15,
        bottom: 15
    },
    favText: {
        color: "#fff",
        fontSize: 15
    }
};

const mapStateToProps = (state) => {
    return state;
};

OfferDetail.propTypes = {
    favoriteAction: PropTypes.func,
    shareData: PropTypes.func,
    navigation: PropTypes.instanceOf(Object)
};

const OfferDetailRedux = connect(mapStateToProps, {
    favoriteAction, shareData
})(OfferDetail);

export {OfferDetailRedux as OfferDetail};
