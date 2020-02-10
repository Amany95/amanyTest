import React, {Component} from "react";
import {Alert, Platform, ScrollView, Text, TouchableOpacity, View} from "react-native";
import Communications from "react-native-communications";
import {connect} from "react-redux";
import HowToGetHere from "./HowToGetHere";
import {CachedImage} from "react-native-img-cache";
import {getDefaultLanguageText, translateText} from "../translation/translate";
import {Button} from "../components/common";
import config from "../../config/config";

class Contact extends Component {
    static navigationOptions = ({navigation}) => {
        const {state} = navigation;
        if (state.params && state.params.type === "REPLACE")
            return {
                title: translateText("ContactUs").toUpperCase(),
                headerLeft: <TouchableOpacity onPress={() => navigation.navigate("DrawerOpen")}>
                    <CachedImage source={require("../../assets/icons/menu-icon.png")}
                                 style={{width: 20, height: 20, margin: 15}}
                    />
                </TouchableOpacity>
            };
        return {
            title: translateText("ContactUs").toUpperCase()
        };
    };

    render() {
        return (
            <View style={{height: "100%"}}>
                <ScrollView>
                    <View style={{height: 200}}>
                        <HowToGetHere liteMode={false}/>
                    </View>
                    <View style={{marginLeft: 16, marginRight: 16}}>
                        <View style={{marginTop: 15}}>
                            <Text style={styles.title}>{translateText("Address").toUpperCase()}</Text>
                            <Text style={styles.titleStyle}>{getDefaultLanguageText(this.props.mall.address)}</Text>
                        </View>

                        <View style={{marginTop: 15}}>
                            <Text style={styles.title}>{translateText("FollowUs").toUpperCase()}</Text>
                            <View style={{flexDirection: "row", marginTop: 5}}>
                                <Button style={styles.socialButton} onPress={() => {
                                    Communications.web(this.props.mall.social.facebook)
                                }}>
                                    <CachedImage source={require("../../assets/icons/follow_facebook.png")}
                                                 style={styles.iconStyle}/>
                                </Button>
                                <Button style={styles.socialButton} onPress={() => {
                                    Communications.web(this.props.mall.social.instagram)
                                }}>
                                    <CachedImage source={require("../../assets/icons/follow_instagram.png")}
                                                 style={styles.iconStyle}/>
                                </Button>
                                <Button style={styles.socialButton} onPress={() => {
                                    Communications.web(this.props.mall.social.twitter)
                                }}>
                                    <CachedImage source={require("../../assets/icons/follow_twitter.png")}
                                                 style={styles.iconStyle}/>
                                </Button>
                            </View>
                        </View>
                    </View>

                    <View style={styles.buttonGroupContainer}>
                        <Button style={styles.buttonStyle}
                                onPress={() => Communications.phonecall(this.props.mall.phone, false)}>
                            <Text style={styles.button}>{translateText("Call")}</Text>
                        </Button>

                        <Button style={styles.buttonStyle}
                                onPress={() => {
                                    if (Platform.OS === "ios") {
                                        Alert.alert("Website", this.props.mall.web, [
                                                {
                                                    text: "Cancel",
                                                    onPress: () => {
                                                    }
                                                },
                                                {
                                                    text: "OK", onPress: () => {
                                                        Communications.web(this.props.mall.web)
                                                    }
                                                }
                                            ],
                                            {cancelable: true}
                                        )
                                    } else {
                                        Communications.web(this.props.mall.web)
                                    }
                                }}>
                            <Text style={styles.button}>{translateText("Go to website")}</Text>
                        </Button>
                        <Button style={styles.buttonStyle} onPress={() => {
                            if (Platform.OS === "ios") {
                                Alert.alert(translateText("E-mail"), this.props.mall.mail, [
                                        {
                                            text: "Cancel",
                                            onPress: () => {
                                            }
                                        },
                                        {
                                            text: "OK", onPress: () => {
                                                Communications.email([this.props.mall.mail], null, null, "", "")
                                            }
                                        }
                                    ],
                                    {cancelable: true}
                                )
                            } else {
                                Communications.email([this.props.mall.mail], null, null, "", "")
                            }
                        }}>
                            <Text style={styles.button}>{translateText("E-mail")}</Text>
                        </Button>
                        <Button style={styles.buttonStyle} onPress={() => {
                            Communications.web("https://www.google.com/maps/search/?api=1&query=" + this.props.mall.latitude + "," + this.props.mall.longitude)
                        }}>
                            <Text style={styles.button}>{translateText("Get directions")}</Text>
                        </Button>
                    </View>
                </ScrollView>

                <View style={styles.LogoContainer}>
                    <CachedImage source={require("../../assets/images/designed_by_kns.png")}
                                 resizeMode={'contain'}
                                 style={{height: 40}}/>
                </View>

            </View>
        );
    }
}

const styles = {
    container: {flex: 1},
    image: {
        resizeMode: "cover",
        width: "100%",
        height: 220
    },
    imageLogo: {
        resizeMode: "contain",
        width: "100%",
        height: 100
    },
    cardContainer: {
        backgroundColor: "#fff",
        marginRight: 15,
        marginLeft: 15,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        flex: 1
    },
    logoContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    titleStyle: {
        color: "#000"
    },
    title: {
        fontSize: 18,
        fontWeight: "300",
        color: config().DEFAULT_BUTTON_HIGHLIGHT_COLOR,
        marginBottom: 5
    },
    iconStyle: {
        width: 30,
        height: 30,
        resizeMode: "contain"
    },
    LogoContainer: {
        alignSelf: "center"
    },
    button: {
        color: "#000",
        width: "100%",
        textAlign: "center",
        fontSize: 14,
        fontWeight: "300",
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 5,
        paddingRight: 5,
        alignSelf: "center"
    },
    buttonStyle: {
        flex: 1,
        borderRightWidth: 1,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#000",
        alignItems: "center",
        justifyContent: "center"
    },
    buttonGroupContainer: {
        flexDirection: "row",
        marginLeft: 15,
        marginRight: 15,
        marginTop: 20,
        borderLeftWidth: 1,
        borderColor: "#000"
    },
    socialButton: {
        marginRight: 8
    }
};

const mapStateToProps = ({main}) => {
    const {payload} = main;
    return {mall: payload.mall}
};

const ContactRedux = connect(mapStateToProps)(Contact);

export {ContactRedux as Contact}
