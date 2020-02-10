/* eslint-disable react/no-deprecated */
import React, {Component} from "react";
import {Alert, BackHandler, NetInfo, StatusBar, View} from "react-native";
import {addNavigationHelpers, NavigationActions} from "react-navigation";
import {connect} from "react-redux";
import RNMallFrameClient from "react-native-mall-frame-client";
import PropTypes from "prop-types";
import Orientation from "react-native-orientation";
import OneSignal from "react-native-onesignal";
import BluetoothManager from "react-native-bluetooth-listener";
import _ from "lodash";

import Main from "./navigators/Main";
import config, {beaconMajor} from "../config/config";
import {setIsConnected} from "./actions/Main";
import {bindActionCreators} from "redux";
import {setLocale} from "./actions/i18n";
import {NotificationReceived, NotificationViewed} from "./actions/Notification";
import AsyncStorage from "../app/utils/AsyncStorage";
import {translateText} from "./translation/translate";
import {ActiveBeacons} from "./actions/Beacon";
import {StatusChanged} from "./actions/Bluetooth";

class Router extends Component {
    constructor() {
        super();
        this.handleFirstConnectivityChange = this.handleFirstConnectivityChange.bind(this);
        this.onBackPress = this.onBackPress.bind(this);

        this.state = {
            browserClose: true
        };

        OneSignal.init("cbd881f5-c00c-4fcc-8c99-72c3eae3fd4c", {kOSSettingsKeyAutoPrompt: true});
        OneSignal.addEventListener("received", this.onReceived);
        OneSignal.addEventListener("opened", this.onOpened);
        OneSignal.addEventListener("ids", this.onIds);
    }

    beaconDidRangeEvent = null;

    componentWillReceiveProps(nextProps) {
        if (nextProps.appLoadedSuccessfully && nextProps.notification && nextProps.notification.navigationURL) {
            this.props.NotificationViewed();

            Alert.alert(
                nextProps.notification.title,
                nextProps.notification.body,
                [
                    {
                        text: translateText("Cancel"), onPress: () => {
                        }, style: "cancel"
                    },
                    {
                        text: translateText("OK"), onPress: () => {
                            if (this.props.nav.routes[0] && this.props.nav.routes[0].routeName === "Splash") {
                                this.props.dispatch(
                                    NavigationActions.reset({
                                        index: 0,
                                        actions: [NavigationActions.navigate({routeName: "amazingDrawer"})]
                                    })
                                );
                            }

                            this.checkNotificationAndRedirect(nextProps.notification.navigationURL, nextProps.notification.navigationParams);
                        }
                    }
                ],
                {cancelable: true}
            );
        }
    }

    componentWillMount() {
        // Lock to Portrait all application
        Orientation.lockToPortrait();

        this.beaconDidRangeEvent = RNMallFrameClient.on(
            "beaconsDidRange",
            (data) => {

                if (data.beacons.length > 0) {
                    const beacons = data.beacons.filter((beacon) => {
                        return beacon.major === beaconMajor;
                    });
                    this._debounceBeacons(beacons);
                }
                else {
                    this._debounceBeacons([]);
                }
            }
        );

        this._debounceBeacons = _.debounce(this.props.ActiveBeacons, 1000, {leading: false, trailing: true});

        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);

        BluetoothManager.getCurrentState().then(this.handleBluetoothChanges);
        BluetoothManager.addEventListener("change", this.handleBluetoothChanges);

        OneSignal.registerForPushNotifications();
        OneSignal.inFocusDisplaying(2);
        OneSignal.requestPermissions({
            alert: true,
            badge: true,
            sound: true
        });
        OneSignal.enableVibrate(true);
        OneSignal.enableSound(true);

        OneSignal.checkPermissions(() => {
            // console.log(permissions);
        });

        OneSignal.configure();
    }

    componentWillUnmount() {
        /**
         *
         * remove listeners
         */
        OneSignal.removeEventListener("received", this.onReceived);
        OneSignal.removeEventListener("opened", this.onOpened);
        OneSignal.removeEventListener("ids", this.onIds);

        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
        NetInfo.isConnected.removeEventListener(
            "connectionChange",
            this.handleFirstConnectivityChange
        );
        BluetoothManager.removeEventListener("change", this.handleBluetoothChanges);
        this.beaconDidRangeEvent.remove();
    }

    handleBluetoothChanges = (resp) => {
        let {connectionState} = resp.type;
        this.props.BluetoothStatusChanged(connectionState === "on");
    };

    onReceived = async (openResult) => {
        const notification = {
            body: openResult.payload.body,
            title: openResult.payload.title || "Citystars",
            date: new Date(),
            notificationID: openResult.payload.notificationID,
            additionalData: openResult.payload.additionalData
        };

        try {
            this.Notifications = await AsyncStorage.getItem("notifications") ? JSON.parse(await AsyncStorage.getItem("notifications")) : [];
        }
        catch (err) {
            this.Notifications = [];
        }

        this.Notifications.push(notification);

        AsyncStorage.setItem("notifications", JSON.stringify(this.Notifications));
    };

    onOpened = ({notification}) => {

        if (notification.payload && notification.payload.additionalData) {
            let {body, title} = notification.payload;
            const {t, d} = notification.payload.additionalData;

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

            this.props.NotificationReceived({
                navigationURL, navigationParams, body, title: title || "Citystars"
            });
        }
    };

    onIds = (device) => {
        config().setPushToken(device.pushToken);
        AsyncStorage.setItem("push_token", JSON.stringify(device.pushToken));
    };

    checkNotificationAndRedirect(navigationURL, navigationParams) {
        /**
         * if notification received when app started and user click then OK in alert dialog
         *
         */
        if (navigationURL && navigationParams) {
            navigationParams["type"] = "REPLACE";

            if (navigationURL === "Browser") {
                if (this.state.browserClose) {
                    this.setState({
                        browserClose: false
                    });

                    this.props.dispatch(
                        NavigationActions.navigate({
                            routeName: navigationURL,
                            params: navigationParams
                        })
                    );
                }
            }
            else {
                this.props.dispatch(
                    NavigationActions.navigate({
                        routeName: navigationURL,
                        params: navigationParams
                    })
                );
            }

        }
        else if (navigationURL) {
            this.props.dispatch(
                NavigationActions.navigate({
                    routeName: navigationURL,
                    params: {
                        type: "REPLACE"
                    }
                })
            );
        }
    }

    componentDidMount() {
        NetInfo.isConnected.fetch().then(() => {
        });
        NetInfo.isConnected.addEventListener("connectionChange", this.handleFirstConnectivityChange);
    }

    handleFirstConnectivityChange(isConnected) {
        /**
         *
         * save handling connection data to store
         */

        this.props.dispatch(setIsConnected(isConnected));
    }

    onBackPress = () => {
        const {dispatch} = this.props;
        dispatch(NavigationActions.back());
        return true;
    };

    render() {
        const {dispatch, nav} = this.props;

        return (
            <View style={{flex: 1}}>
                <StatusBar backgroundColor={config().DEFAULT_STATUS_BAR_COLOR}
                           barStyle={config().DEFAULT_STATUS_BAR_STYLE}/>
                <Main
                    navigation={addNavigationHelpers({
                        dispatch: dispatch,
                        state: nav
                    })}
                    screenProps={{
                        locale: this.props.locale,
                        setLocale: this.props.setLocale
                    }}
                />
            </View>
        );
    }
}

Router.propTypes = {
    dispatch: PropTypes.func,
    NotificationViewed: PropTypes.func,
    locale: PropTypes.string,
    setLocale: PropTypes.func,
    nav: PropTypes.object,
    appLoadedSuccessfully: PropTypes.bool,
    notification: PropTypes.object,
    NotificationReceived: PropTypes.func,
    BluetoothStatusChanged: PropTypes.func,
    ActiveBeacons: PropTypes.func
};

const mapStateToProps = (state) => {
    const {live} = state.beacon;
    const {enabled} = state.bluetooth;

    return {
        nav: state.nav,
        locale: state.i18n.locale,
        appLoadedSuccessfully: state.main.appLoadedSuccessfully,
        notification: state.notification.notification,
        beacons: live,
        bluetooth: enabled
    };
};

function mapDispatchToProps(dispatch) {
    const setLocaleAction = bindActionCreators(setLocale, dispatch);
    const notificationReceivedAction = bindActionCreators(NotificationReceived, dispatch);
    const notificationViewedAction = bindActionCreators(NotificationViewed, dispatch);
    const statusChangedAction = bindActionCreators(StatusChanged, dispatch);
    const activeBeaconsAction = bindActionCreators(ActiveBeacons, dispatch);
    return {
        setLocale: setLocaleAction,
        NotificationReceived: notificationReceivedAction,
        NotificationViewed: notificationViewedAction,
        BluetoothStatusChanged: statusChangedAction,
        ActiveBeacons: activeBeaconsAction,
        dispatch
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Router);
