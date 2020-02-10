/* eslint-disable react/no-deprecated */
import React from "react";
import {Alert, Animated, View} from "react-native";
import {checkServer} from "../actions/Main";
import {connect} from "react-redux";
import {NavigationActions} from "react-navigation";
import {CachedImage} from "react-native-img-cache";
import {translateText} from "../translation/translate";
import {DefaultButton} from "../components/buttons";
import config from "../../config/config";
import {ActionBluetoothPermission} from "../actions/Bluetooth";
import PropTypes from "prop-types";

class Splash extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        this.animatedValue = new Animated.Value(0);
    }

    componentDidMount() {
        this.props.checkServer().then(() => {
            this.props.ActionBluetoothPermission(false, this.props.payload.mall.geofence_radius);
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.user && nextProps.user.isLoggedIn && !nextProps.error && nextProps.payload !== undefined && nextProps.payload !== null && nextProps.nav.routes[0] && nextProps.nav.routes[0].routeName === "Splash") {
            this.props.navigation.dispatch(
                NavigationActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({routeName: "amazingDrawer"})]
                })
            );
        }
        else if (!nextProps.error && nextProps.payload) {
            // TODO start to animation
            this.animate();
        }
    }

    animate() {
        Animated.timing(
            this.animatedValue,
            {
                toValue: 1,
                duration: 1000
            }
        ).start();
    }

    render() {

        return (
            <View style={styles.rootContainer}>
                <View style={styles.container}>
                    <CachedImage source={require("../../assets/images/splash.png")}
                                 style={styles.introStyle}/>

                    <CachedImage source={require("../../assets/images/splash-logo.png")}
                                 style={styles.introLogoStyle} resizeMode={"contain"}/>
                </View>

                <Animated.View style={{position: "absolute", bottom: 0, opacity: this.animatedValue}}>
                    <DefaultButton title={translateText("join_now")}
                                   titleStyle={{color: "#fff"}}
                                   style={{
                                       backgroundColor: config().BASE_SECOND_COLOR,
                                       marginBottom: 15,
                                       minWidth: 200,
                                       height: 40
                                   }}
                                   onPress={() => {
                                       if (this.props.error !== null) {
                                           Alert.alert(this.props.error.key, this.props.error.content);
                                       }
                                       else if (this.props.payload !== undefined && this.props.payload !== null) {
                                           this.props.navigation.dispatch(
                                               NavigationActions.reset({
                                                   index: 0,
                                                   actions: [NavigationActions.navigate({routeName: "amazingDrawer"})]
                                               })
                                           );
                                           this.props.navigation.navigate("Profile");
                                           this.props.navigation.navigate("Register");
                                       }
                                   }}/>

                    <DefaultButton title={translateText("join_later")}
                                   titleStyle={{color: config().BASE_COLOR}}
                                   style={{backgroundColor: "#fff", marginBottom: 30, minWidth: 200, height: 40}}
                                   onPress={() => {
                                       if (this.props.error !== null) {
                                           Alert.alert(this.props.error.key, this.props.error.content);
                                       }
                                       else if (this.props.payload !== undefined && this.props.payload !== null) {
                                           this.props.navigation.dispatch(
                                               NavigationActions.reset({
                                                   index: 0,
                                                   actions: [NavigationActions.navigate({routeName: "amazingDrawer"})]
                                               })
                                           );
                                       }
                                   }}/>
                </Animated.View>
            </View>
        );
    }
}

const styles = {
    rootContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    container: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    introStyle: {
        height: "100%",
        width: "100%"
    },
    introLogoStyle: {
        position: "absolute",
        alignSelf: "center",
        width: "100%",
        height: "100%"
    },
    borderlessButton: {
        color: "#fff"
    }
};

Splash.propTypes = {
    navigation: PropTypes.object,
    checkServer: PropTypes.func,
    error: PropTypes.string,
    payload: PropTypes.object,
    user: PropTypes.object,
    nav: PropTypes.object,
    ActionBluetoothPermission: PropTypes.func,
};

const mapStateToProps = (state) => {
    const {error, loading, payload} = state.main;
    const {notification} = state.notification;
    const {user} = state.auth;

    return {error, loading, payload, nav: state.nav, notification, user};
};

export default connect(mapStateToProps, {checkServer, ActionBluetoothPermission})(Splash);
