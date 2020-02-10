import React from "react";
import {ScrollView, StyleSheet, Text, View} from "react-native";
import Communications from "react-native-communications";
import PropTypes from "prop-types";
import VideoPlayer from "react-native-af-video-player";
import Orientation from "react-native-orientation";

import {getDefaultLanguageText, translateText} from "../../translation/translate";
import {connect} from "react-redux";
import {Button} from "../../components/common";
import config from "../../../config/config";

class CinemaDetail extends React.Component {
    static navigationOptions = ({navigation}) => {
        const {state} = navigation;

        if (state.params && state.params.fullscreen) {
            return {
                header: null
            };
        }

        return {
            title: `${getDefaultLanguageText(state.params.title)}`.toUpperCase(),
            headerTintColor: "#fff"
        };
    };

    componentWillMount() {
        Orientation.unlockAllOrientations();

        this.onFullScreen(false);
    }

    onFullScreen(status) {
        // Set the params to pass in the fullscreen status to navigationOptions
        this.props.navigation.setParams({
            fullscreen: status
        });

    }

    componentWillUnmount() {
        Orientation.lockToPortrait();
    }

    render() {
        const {poster, title, explanation, director, genre, cast, buy_ticket, trailer, hours} = this.props.navigation.state.params.data.item;

        return (
            <View style={styles.container}>
                <VideoPlayer
                    autoPlay={false}
                    url={trailer}
                    title={getDefaultLanguageText(title)}
                    placeholder={poster}
                    logo={poster}
                    onFullScreen={(status) => {
                        this.onFullScreen(status);
                    }}
                    rotateToFullScreen
                />
                <ScrollView style={styles.scrollContainer}>
                    <View
                        style={[styles.partContainer, {flexDirection: this.props.locale.includes("ar") ? "row-reverse" : "row"}]}>

                        <Text style={styles.defaultTitle}>{translateText("Genre")}:</Text>
                        <Text style={styles.defaultText}>{getDefaultLanguageText(genre)}</Text>

                    </View>
                    <View
                        style={[styles.partContainer, {flexDirection: this.props.locale.includes("ar") ? "row-reverse" : "row"}]}>
                        <Text style={styles.defaultTitle}>{translateText("Director")}:</Text>
                        <Text style={styles.defaultText}>{director}</Text>
                    </View>
                    <View
                        style={[styles.partContainer, {flexDirection: this.props.locale.includes("ar") ? "row-reverse" : "row"}]}>
                        <Text style={styles.defaultTitle}>{translateText("Cast")}:</Text>
                        <Text style={styles.defaultText}>{cast}</Text>
                    </View>
                    <View
                        style={[styles.partContainer, {flexDirection: this.props.locale.includes("ar") ? "row-reverse" : "row"}]}>
                        <Text style={styles.sessionText}>{getDefaultLanguageText(hours)}</Text>
                    </View>

                    {
                        buy_ticket !== "" && <View style={{marginTop: 15}}>
                            <View style={styles.buttonGroup}>
                                <Button style={{width: "100%"}} onPress={() => {
                                    Communications.web(buy_ticket);
                                }}>
                                    <Text style={styles.button}>
                                        {translateText("Buy Ticket").toUpperCase()}
                                    </Text>
                                </Button>
                            </View>
                        </View>
                    }

                    <Text style={styles.explanation}>{getDefaultLanguageText(explanation)}</Text>

                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
        button: {
            color: "#fff",
            backgroundColor: config().BASE_COLOR,
            padding: 15,
            textAlign: "center",
            fontSize: 15,
            flex: 1,
            width: "100%"

        },
        buttonGroup: {
            flexDirection: "row",
            paddingTop: 16,
            width: "100%"
        },
        title: {
            fontSize: 18,
            fontWeight: "400",
            alignSelf: "flex-start",
            textAlign: "left"
        },
        explanation: {
            fontSize: 14,
            marginTop: 10
        },
        sessionText: {
            color: "#555",
            fontWeight: "bold",
            padding: 5
        },
        partContainer: {
            marginTop: 15,
            flexDirection: "row"
        },
        defaultText: {
            fontSize: 13,
            color: "#555",
            marginLeft: 10
        },
        defaultTitle: {
            fontSize: 15,
            fontWeight: "600"
        },
        navigationBarStyle: {
            paddingLeft: 10,
            paddingRight: 10
        },
        container: {
            flex: 1
        },
        scrollContainer: {
            marginLeft: 15,
            marginRight: 15
        }
    }
);

const mapStateToProps = ({i18n}) => {
    return i18n;
};

CinemaDetail.propTypes = {
    navigation: PropTypes.instanceOf(Object)
};

const CinemaDetailRedux = connect(mapStateToProps)(CinemaDetail);

export {CinemaDetailRedux as CinemaDetail};
