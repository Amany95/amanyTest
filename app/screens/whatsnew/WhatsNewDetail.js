import React from "react";
import {StyleSheet, Dimensions, Text, View} from "react-native";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {CachedImage} from "react-native-img-cache";

import {favoriteAction} from "../../actions/Favorite";
import {getDefaultLanguageText, translateText} from "../../translation/translate";
import {shareData} from "../../actions/Main";
import {FavButton} from "../../components/buttons";
import AutoHeightWebView from "../../components/common/AutoHeightWebView";
import config from "../../../config/config";

const {width} = Dimensions.get("window");

class WhatsNewDetail extends React.Component {
    static navigationOptions = ({navigation}) => {
        const {state} = navigation;
        return {
            title: `${getDefaultLanguageText(state.params.title)}`.toUpperCase()
        };
    };

    render() {

        const {whatsNew} = this.props.navigation.state.params;

        return (
            <View style={{flex: 1, backgroundColor: "#fff"}}>
                <View style={styles.container}>
                    <CachedImage source={{uri: whatsNew.image}} style={styles.image}/>
                    <View style={styles.shareAndLikeContainer}>
                        <FavButton
                            fav={whatsNew.fav}
                            onPress={() => {
                                this.props.favoriteAction({
                                    userid: whatsNew["userid"],
                                    isFav: whatsNew["fav"],
                                    item_id: whatsNew["_id"],
                                    item_type: "favorite_news"
                                });
                            }}/>
                        <Text style={styles.button} onPress={() => {
                            let shareOptions = {
                                title: getDefaultLanguageText(whatsNew.title),
                                message: getDefaultLanguageText(whatsNew.title),
                                url: whatsNew.image,
                                subject: getDefaultLanguageText(whatsNew.title),
                                type: "image/jpeg"
                            };

                            this.props.shareData(shareOptions);
                        }}>{translateText("Share").toUpperCase()}</Text>
                    </View>
                    <Text style={styles.title}>{getDefaultLanguageText(whatsNew.title)}</Text>
                    <Text style={styles.subtitle}>{getDefaultLanguageText(whatsNew.subtitle)}</Text>
                    <AutoHeightWebView
                        navigation={this.props.navigation}
                        defaultUrl={whatsNew.explanation}
                        autoHeight={true}
                    />
                </View>
            </View>
        );
    }
}

const styles = {
    shareAndLikeContainer: {
        paddingLeft: 15,
        paddingRight: 15,
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
        marginLeft: 15
    },
    subtitle: {
        width: "100%",
        fontSize: 16,
        marginLeft: 15,
        marginTop: 5
    },
    explanation: {
        fontSize: 13,
        marginTop: 10
    },
    favButton: {
        position: "absolute",
        width: "100%",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#103768",
        bottom: 0,
        borderColor: "#103768"
    },
    favText: {
        color: "#fff",
        fontSize: 15
    }
};

const mapStateToProps = (state) => {
    return state;
};

WhatsNewDetail.propTypes = {
    favoriteAction: PropTypes.func,
    shareData: PropTypes.func,
    navigation: PropTypes.instanceOf(Object)
};

const WhatsNewDetailRedux = connect(mapStateToProps, {
    favoriteAction, shareData
})(WhatsNewDetail);

export {WhatsNewDetailRedux as WhatsNewDetail};
