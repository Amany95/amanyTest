/* eslint-disable react/no-deprecated */
import React, {Component} from "react";
import {Alert, Platform, PushNotificationIOS, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {CachedImage} from "react-native-img-cache";
import _ from "lodash";
import moment from "moment";
import PropTypes from "prop-types";
import {NavigationActions} from "react-navigation";

import {translateText} from "../translation/translate";
import AsyncStorage from "../utils/AsyncStorage";

class Notifications extends Component {
    state = {
        notifications: [],
        asyncNotifications: [],
        browserClose: false
    };

    static navigationOptions = ({navigation}) => {
        const {state} = navigation;
        if (state.params && state.params.type === "REPLACE") {
            return {
                title: translateText("Notifications").toUpperCase(),
                headerLeft: <TouchableOpacity onPress={() => {
                    navigation.navigate("DrawerOpen");
                }}>

                    <CachedImage source={require("../../assets/icons/menu-icon.png")}
                                 style={{width: 20, height: 20, margin: 15}}
                    />
                </TouchableOpacity>
            };
        }
        return {
            title: translateText("Notifications").toUpperCase()
        };
    };

    async componentWillMount() {
        const notifications = await AsyncStorage.getItem("notifications") ? JSON.parse(await AsyncStorage.getItem("notifications")) : [];

        if (Platform.OS === "ios") {
            PushNotificationIOS.getDeliveredNotifications((data) => {

            });
        }
        // else {
        this.setState({notifications});

        // }

    }

    onOpened = (notification) => {
        // console.log("notification.additionalData", notification.additionalData);

        if (notification.additionalData) {
            let {body} = notification;
            const {t, d} = notification.additionalData;

            let navigationURL = false, navigationParams = false;

            if (t === "st" && d === "") {
                navigationURL = "Brands";
            }
            else if (t === "st" && d !== "") {
                navigationURL = "Brands";
                navigationParams = {
                    data: d,
                    notification: true
                };

            }
            else if (t === "of" && d === "") {
                navigationURL = "Offers";

            }
            else if (t === "of") {
                navigationURL = "Offers";
                navigationParams = {
                    offer: d,
                    notification: true
                };
            }
            else if (t === "ev" && d === "") {
                navigationURL = "Events";
            }
            else if (t === "ev") {
                navigationURL = "Events";
                navigationParams = {
                    event: d,
                    notification: true
                };
            }
            else if (t === "ne" && d === "") {
                navigationURL = "WhatsNews";
            }
            else if (t === "ne") {
                navigationURL = "WhatsNews";
                navigationParams = {
                    whatsNew: d,
                    notification: true
                };
            }
            else if (t === "map" && d === "") {
                navigationURL = "MallMap";
            }
            else if (t === "web" && d === "") {
                navigationURL = "Browser";
                navigationParams = {
                    uri: d
                };
            }
            else if (t === "no") {
                Alert.alert("Citystars", body);
            }

            if (navigationURL && navigationParams) {
                if (navigationURL === "Browser") {
                    if (this.state.browserClose) {
                        this.setState({
                            browserClose: false
                        });

                        this.props.navigation.dispatch(
                            NavigationActions.navigate({
                                routeName: navigationURL,
                                params: navigationParams
                            })
                        );
                    }
                }
                else {
                    this.props.navigation.dispatch(
                        NavigationActions.navigate({
                            routeName: navigationURL,
                            params: navigationParams
                        })
                    );
                }

            }
            else if (navigationURL) {
                this.props.navigation.dispatch(
                    NavigationActions.navigate({
                        routeName: navigationURL
                    })
                );
            }
        }
    };

    render() {
        return this.state.notifications.length ?
            <ScrollView style={styles.container}>{this.state.notifications.map((notification, index) => {
                return <View key={`${index}`}
                             style={{flexDirection: "row", marginTop: 10}}>
                    <TouchableOpacity
                        style={{flex: 1, justifyContent: "center"}}
                        onPress={() => {
                            this.onOpened(notification);
                        }}
                    >
                        <Text style={{fontSize: 16, fontWeight: "bold"}}>{notification.title}</Text>
                        <Text style={{fontSize: 14}}>{notification.body}</Text>
                        <Text style={{fontSize: 13, color: "#ccc"}}>{moment(notification.date).fromNow()}</Text>

                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{width: 50, alignItems: "center", justifyContent: "center"}}
                        onPress={() => {
                            if (notification.identifier) {
                                PushNotificationIOS.removeDeliveredNotifications([notification.identifier]);
                            }
                            else {

                                // Remove from Async storage
                                let array = JSON.parse(JSON.stringify(this.state.asyncNotifications));
                                let i = _.findIndex(array, (object) => {
                                    return object.notificationID === notification.notificationID;
                                });

                                array.splice(i, 1);

                                AsyncStorage.setItem("notifications", JSON.stringify(array));
                                this.setState({asyncNotifications: array});
                            }

                            // Remove from state

                            let array = _.cloneDeep(this.state.notifications);
                            let i = _.findIndex(array, (object) => {
                                return object.notificationID === notification.notificationID;
                            });

                            array.splice(i, 1);

                            this.setState({notifications: array});
                        }}
                    >
                        <CachedImage
                            resizeMode={"contain"}
                            source={require("../../assets/icons/trash_icon.png")}
                            style={{width: 36, height: 36, margin: 15}}/>
                    </TouchableOpacity>
                </View>;
            })}
            </ScrollView>
            :
            <View style={[styles.container, {alignItems: "center", justifyContent: "center"}]}>
                <CachedImage source={require("../../assets/images/no_notifications.png")}/>
                <Text style={{margin: 15}}>{translateText("NotReceivedNotificationYet")}</Text>
            </View>;
    }
}

const styles = {
    container: {
        flex: 1,
        padding: 15
    }
};
Notifications.propTypes = {
    navigation: PropTypes.instanceOf(Object)
};

export {Notifications};
