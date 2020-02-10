import React from "react";
import {StyleSheet, Dimensions, Text, View} from "react-native";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {CachedImage} from "react-native-img-cache";

import {getDefaultLanguageText, translateText} from "../../translation/translate";
import {favoriteAction} from "../../actions/Favorite";
import {shareData} from "../../actions/Main";
import {FavButton} from "../../components/buttons";
import AutoHeightWebView from "../../components/common/AutoHeightWebView";
import config from "../../../config/config";

const {width} = Dimensions.get("window");

class EventDetail extends React.Component {
    static navigationOptions = ({navigation}) => {
        const {state} = navigation;
        return {
            title: `${getDefaultLanguageText(state.params.title)}`.toUpperCase()
        };
    };

    render() {
        const {event} = this.props.navigation.state.params;

        return (
            <View style={{flex: 1, backgroundColor: "#fff"}}>
                <View style={styles.container}>
                    <CachedImage source={{uri: event.image}} style={styles.image}/>
                    <View style={styles.shareAndLikeContainer}>
                        <FavButton
                            fav={event.fav}
                            onPress={() => {
                                this.props.favoriteAction({
                                    userid: event["userid"],
                                    isFav: event["fav"],
                                    item_id: event["_id"],
                                    item_type: "favorite_events"
                                });
                            }}/>
                        <Text style={styles.button} onPress={() => {
                            let shareOptions = {
                                title: getDefaultLanguageText(event.title),
                                message: getDefaultLanguageText(event.title),
                                url: event.image,
                                subject: getDefaultLanguageText(event.title),
                                type: "image/jpeg"
                            };

                            this.props.shareData(shareOptions);
                        }}>{translateText("Share").toUpperCase()}</Text>
                    </View>
                    <Text style={styles.title}>{getDefaultLanguageText(event.title)}</Text>
                    <Text style={styles.subtitle}>{getDefaultLanguageText(event.subtitle)}</Text>
                    <AutoHeightWebView
                        navigation={this.props.navigation}
                        defaultUrl={event.explanation}
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

EventDetail.propTypes = {
    shareData: PropTypes.func,
    favoriteAction: PropTypes.func,
    navigation: PropTypes.instanceOf(Object)
};

const EventDetailRedux = connect(mapStateToProps, {
    favoriteAction, shareData
})(EventDetail);

export {EventDetailRedux as EventDetail};
