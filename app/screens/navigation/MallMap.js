/* eslint-disable react/no-deprecated */
import React from "react";
import {Alert, Platform, StyleSheet, Text, TouchableOpacity, View, WebView} from "react-native";
import {NewSP, resetSP} from "../../actions/Floor";
import {SlideUpView} from "../../components/navigation/animateView";
import config, {DEBUG_MODE} from "../../../config/config";
import {CachedImage} from "react-native-img-cache";
import {translateText} from "../../translation/translate";
import Toast from "react-native-easy-toast";
import HorizontalPicker from "../../components/common/HorizontalPicker";
import {connect} from "react-redux";
import AsyncStorage from "../../utils/AsyncStorage";
import PropTypes from "prop-types";
import {
    BeaconParkingRequest,
    BeaconParkingSpot,
    BeaconVisitedRequest,
    VisitedLocationShowed
} from "../../actions/Beacon";
import {ActionBluetoothPermission, permissionIsGranted} from "../../actions/Bluetooth";
import Loader from "../../components/common/Loader";
import ModalSelector from "../../components/common/modal/ModalSelector";

let HEADER = "#fff";
let BGWASH = "rgba(255,255,255,0.8)";

const LOCATION_KEYWORDS = {
    FIRST_MESSAGE: "please_follow_path",
    SAME_FLOOR: "same_floor",
    GO_TO_UP: "sp_up_floor",
    GO_TO_DOWN: "sp_down_floor",
    LAST_FLOOR: "sp_end_floor"
};

const UP = 1;
const DOWN = 2;

class MallMap extends React.Component {
    static navigationOptions = ({navigation}) => {
        const {state} = navigation;
        if (state.params && state.params.type === "REPLACE") {
            return {
                title: translateText("MallMap").toUpperCase(),
                headerLeft: <TouchableOpacity onPress={() => {
                    navigation.navigate("DrawerOpen");
                }}>
                    <CachedImage source={require("../../../assets/icons/menu-icon.png")}
                                 style={{width: 20, height: 20, margin: 15}}
                    />
                </TouchableOpacity>
            };
        }
        return {
            title: translateText("MallMap").toUpperCase()
        };
    };

    webview = null;
    state = {
        locationOpened: null,
        selectedFloor: 1,
        url: {uri: ""},
        animationStarted: false,
        loading: false,
        parkingMode: false
    };

    constructor(props, context) {
        super(props, context);
        this.beforeButton = this.beforeButton.bind(this);
        this.isShowUserLocationMap = this.isShowUserLocationMap.bind(this);
        this.visitedBeacon = this.visitedBeacon.bind(this);
        this.locationNotFound = this.locationNotFound.bind(this);
    }

    locationNotFound = () => {
        if (this.state.loading) {
            this.setState({
                loading: false
            }, () => {
                setTimeout(() => {
                    Alert.alert(translateText("error"), translateText("location_failed"));
                }, 1000);
            });
        }

        if (this.props.liveBeacon && this.props.liveBeacon.length === 0) {
            this.postMessage({
                action: "resetBeaconLocation"
            });
        }
    };

    visitedBeacon = () => {
        if (this.props.liveBeacon && this.props.liveBeacon.length > 0) {
            if (!this.state.parkingMode) {
                this.props.BeaconVisitedRequest(this.props.liveBeacon);
            }
        }
    };

    componentWillMount() { 
        if (config().beaconMode && !this.state.animationStarted) {
            this.userLocationWithBeacon = setInterval(this.visitedBeacon, 5000);
            this.userLocationNotFoundALongTime = setInterval(this.locationNotFound, 15000);
        }
        if (this.props.navigation.state && this.props.navigation.state.params) {
            const {parkingMode} = this.props.navigation.state.params;

            if (parkingMode) {
                this.setState({
                    parkingMode: true,
                    loading: true
                });
            }
        }

        this.setState({
            url: Platform.OS === "android" ? DEBUG_MODE ? require("../../../map/map.html") : {uri: "file:///android_asset/map/map.html"} : require("../../../map/map.html")
        });

        if (this.props.navigation.state.params) {
            const beacons = this.props.liveBeacon;
            const {from, to, type} = this.props.navigation.state.params;

            if (from && to) {
                if (from.type === "beacons") {
                    this.props.NewSP("", to, type, beacons);
                }
                else {
                    if (to.type === "beacons") {
                        this.props.NewSP(from, "", type, beacons);
                    }
                    else {
                        this.props.NewSP(from, to, type);
                    }
                }
            }
        }
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.visitedBeacons) {
            this.postMessage({
                action: "visitedBeacon",
                payload: nextProps.visitedBeacons
            });

            if (!this.state.animationStarted) {
                this.levelSelect(nextProps.visitedBeacons.floor_no);
            }

            if (this.props.bluetooth && (this.state.loading || this.state.parkingMode)) {
                this.setState({
                    loading: false
                });

                this.postMessage({
                    action: "showBeaconLocation"
                });
            }

            this.props.VisitedLocationShowed();
        }
    }

    componentWillUnmount() {
        if (this.userLocationWithBeacon) {
            clearInterval(this.userLocationWithBeacon);
        }

        if (this.userLocationNotFoundALongTime) {
            clearInterval(this.userLocationNotFoundALongTime);
        }

        if (this.props.sp) {
            this.props.resetSP();
        }
    }

    MapLoadAfter = () => {
        const {state} = this.props.navigation;
        if (state && state.params && state.params.locationOpen) {
            this.postMessage({
                action: "selectLocation",
                payload: {
                    locationOpen: state.params.locationOpen,
                    locationType: state.params.locationType
                }
            });
        }

        if (this.props.sp && state && state.params && state.params.from && state.params.to) {
            const {sp, navigation} = this.props;
            this.setState({
                animationStarted: true
            });

            if (this.toast && sp.direction.length > 1) {
                this.toast.show(translateText(LOCATION_KEYWORDS["FIRST_MESSAGE"]).replace("%1", sp.direction[0]).replace("%2", sp.direction[sp.direction.length - 1]), 3000);
            }

            this.postMessage({
                action: "showNavigation",
                response: sp,
                from: navigation.state.params.from,
                to: navigation.state.params.to
            });
        }

        if (this.state.parkingMode) {
            this.props.BeaconParkingRequest(this.selectParkingLocation.bind(this));
        }
    };

    onMessage = (event) => {
        let message = JSON.parse(event.nativeEvent.data);
        switch (message.action) {
            case "mapLoaded":
                this.MapLoadAfter();
                break;
            case "locationOpened":
                this.setState({
                    locationOpened: message.data,
                    animationStarted: false
                });
                this.props.resetSP();
                break;
            case "levelSwitched":
                this.setState({
                    selectedFloor: message.data
                });
                break;
            default:
                break;
        }

    };

    postMessage = (data) => {
        if (this.webview) {
            this.webview.postMessage(JSON.stringify(data));
        }
    };

    levelSelectorContainer = () => {
        return this.props.levels.map((floor) => {
            const {no} = floor;
            return (
                <HorizontalPicker.Item label={no === 0.5 ? "MZ" : no.toString()} value={no}
                                       key={no}/>
            );
        });
    };

    levelSelect = (no) => {
        this.setState({
            selectedFloor: no
        });

        this.postMessage({
            action: "selectFloor",
            floorNo: no
        });
    };

    _calculateDirection = () => {
        const {direction} = this.props.sp;

        if (direction && direction.length > 0) {
            if (direction[0] > direction[1]) {
                return DOWN;
            }
            else {
                return UP;
            }
        }
    };

    _getAnimationMessages = () => {
        const {direction} = this.props.sp;

        if (direction.length === 1) {
            return (
                <Text
                    style={styles.locationWordsText}>{translateText(LOCATION_KEYWORDS["SAME_FLOOR"]).replace("%s", this.state.selectedFloor)}</Text>
            );
        }
        else if (direction.length > 1 && this._calculateDirection() === UP && direction[direction.length - 1] !== this.state.selectedFloor) {
            return (
                <Text style={styles.locationWordsText}>{translateText(LOCATION_KEYWORDS["GO_TO_UP"])}</Text>
            );
        }
        else if (direction.length > 1 && this._calculateDirection() === DOWN && direction[direction.length - 1] !== this.state.selectedFloor) {
            return (
                <Text style={styles.locationWordsText}>{translateText(LOCATION_KEYWORDS["GO_TO_DOWN"])}</Text>
            );
        }
        else if (direction[direction.length - 1] === this.state.selectedFloor) {
            return (
                <Text
                    style={styles.locationWordsText}>{translateText(LOCATION_KEYWORDS["LAST_FLOOR"]).replace("%s", this.state.selectedFloor)}</Text>
            );
        }
    };

    beforeButton = () => {
        const {direction} = this.props.sp;
        const index = this.findIndex(direction, this.state.selectedFloor);
        if (index !== undefined) {
            return direction[index - 1];
        }
        else {
            return undefined;
        }
    };

    findIndex = (direction, object) => {
        const index = direction.indexOf(object);
        if (index === -1) {
            return undefined;
        }
        return index;
    };

    nextButton = () => {
        const {direction} = this.props.sp;
        const index = this.findIndex(direction, this.state.selectedFloor);
        if (index !== undefined) {
            return direction[index + 1];
        }
        else {
            return undefined;
        }
    };

    spAnimationContainer = () => {

        if (!this.props.sp) {
            return null;
        }
        const {direction, type} = this.props.sp;

        if (!this.state.locationOpened !== null && this.state.animationStarted && this.findIndex(direction, this.state.selectedFloor) !== undefined) {
            return <View style={styles.spAnimationContainer}>
                <View style={{width: 50}}>
                    {this.beforeButton() !== undefined ?
                        <TouchableOpacity onPress={() => {
                            this.levelSelect(this.beforeButton());
                        }}>
                            {this._calculateDirection() === DOWN ?
                                type === "disabled" ?
                                    <CachedImage
                                        style={styles.imageUpDown}
                                        source={require("../../../assets/icons/floor_up.png")}/> :
                                    <CachedImage
                                        style={styles.imageUpDown}
                                        source={require("../../../assets/icons/floor_up_1.png")}/>
                                :
                                type === "disabled" ?
                                    <CachedImage
                                        style={styles.imageUpDown}
                                        source={require("../../../assets/icons/floor_down.png")}/> :
                                    <CachedImage
                                        style={styles.imageUpDown}
                                        source={require("../../../assets/icons/floor_down_1.png")}/>
                            }
                        </TouchableOpacity>
                        : null}
                </View>

                {this._getAnimationMessages()}

                <View style={{width: 50}}>
                    {this.nextButton() !== undefined ? <TouchableOpacity onPress={() => {
                        this.levelSelect(this.nextButton());
                    }}>

                        {this._calculateDirection() === DOWN ?
                            type === "disabled" ?
                                <CachedImage
                                    style={styles.imageUpDown}
                                    source={require("../../../assets/icons/floor_down-green.png")}/> :
                                <CachedImage
                                    style={styles.imageUpDown}
                                    source={require("../../../assets/icons/floor_down_red.png")}/>
                            :
                            type === "disabled" ?
                                <CachedImage
                                    style={styles.imageUpDown}
                                    source={require("../../../assets/icons/floor_up-green.png")}/> :
                                <CachedImage
                                    style={styles.imageUpDown}
                                    source={require("../../../assets/icons/floor_up_red.png")}/>
                        }

                    </TouchableOpacity> : null}
                </View>
            </View>;
        }
        return null;
    };

    selectParkingLocation = (parkingSpots) => {
        parkingSpots = parkingSpots.map((parkingSpot, index) => {
            return {
                key: index,
                label: parkingSpot.b,
                parkingSpot
            };
        });

        this.setState({
            parkingSpots,
            loading: false
        });

        setTimeout(() => {
            if (this.parkingDialog) {
                this.parkingDialog.open();
            }
            this.postMessage({
                action: "showBeaconLocation"
            });
        }, 1000);
    };
 
    isShowUserLocationMap = () => {
        return !!(config().beaconMode && !this.state.animationStarted && this.props.bluetooth);
    };

    _renderShowLocationButton() {
        return (
            <View
                style={{
                    height: 48,
                    width: 48,
                    borderRadius: 48,
                    position: "absolute",
                    right: 15,
                    top: 15,
                    opacity: this.isShowUserLocationMap() ? 1 : 0.7
                }}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={{
                        height: 48,
                        width: 48,
                        borderRadius: 48
                    }}
                    onPress={() => {
                        if (this.isShowUserLocationMap()) {
                            
                            if (this.props.liveBeacon && this.props.liveBeacon.length > 0 && this.props.bluetooth) {
                               
                                this.postMessage({
                                    action: "showBeaconLocation"
                                });

                                if (this.state.parkingMode) {
                                    this.props.BeaconParkingRequest(this.selectParkingLocation.bind(this));
                                }

                            }
                            else {
                                this.props.ActionBluetoothPermission(true, this.props.mall.geofence_radius, (data) => {
                                    if (data.error) {

                                        if (data.message) {
                                            Alert.alert(translateText("error"), data.message);
                                        }
                                    }
                                    else {
                                        this.setState({
                                            loading: true
                                        });
                                    }
                                });
                            }
                        }
                        else {
                            if (!this.props.bluetooth) {

                                this.props.ActionBluetoothPermission(true, this.props.mall.geofence_radius, (data) => {
                                    if (data.error) {
                                        if (data.message) {
                                            Alert.alert(translateText("error"), data.message);
                                        }
                                    }
                                    else {

                                        this.setState({
                                            loading: true
                                        });
                                    }
                                });
                            }
                        }
                    }}
                >
                    <CachedImage source={require("../../../assets/icons/map_location.png")}
                                 style={{width: 48, height: 48, resizeMode: "contain"}}/>
                </TouchableOpacity>

                <Loader loading={this.state.loading} title={translateText("detecting_your_location")}
                        onRequestClose={() => {
                            this.setState({loading: false});
                        }}/>
            </View>
        );
    }

    render() {
    
        return (
            <View style={styles.container}>
                <HorizontalPicker
                    style={{
                        borderBottomWidth: 1,
                        borderColor: "#444"
                    }}
                    itemWidth={50}
                    itemHeight={70}
                    selectedValue={this.state.selectedFloor}
                    foregroundColor='#000'
                    onChange={(pickerValue) => {
                        this.levelSelect(pickerValue);
                    }}>

                    {this.levelSelectorContainer()}
                </HorizontalPicker>
                {this.state.parkingMode && <ModalSelector
                    justDialog={true}
                    ref={(ref) => {
                        this.parkingDialog = ref;
                    }}
                    data={this.state.parkingSpots}
                    cancelText={translateText("Cancel")}
                    onChange={(option) => {

                        AsyncStorage.setItem("parking_spot", JSON.stringify(option.parkingSpot));
                        AsyncStorage.removeItem("qr_code");

                        this.props.BeaconParkingSpot(option.parkingSpot);
                        this.props.navigation.goBack();
                    }}/>}
                <View style={{flex: 1}}>
                    <WebView
                        ref={(webview) => {
                            this.webview = webview;
                        }}
                        javaScriptEnabled={true}
                        style={styles.webView}
                        source={this.state.url}
                        onMessage={this.onMessage}
                        onLoadEnd={() => {
                            this.props.levels.forEach((level) => {
                                this.postMessage({
                                    action: "loadLevel",
                                    level: level
                                });
                            });

                            this.postMessage({
                                action: "init",
                                categories: this.props.categories
                            });
                        }}
                    />
                    {this._renderShowLocationButton()}
                </View>

                <SlideUpView locationOpened={this.state.locationOpened}
                             directionButtonDismiss={this.state.parkingMode}
                             navigation={this.props.navigation}
                             navigationBarOnChange={() => {
                                 this.postMessage({
                                     action: "closeNavigation"
                                 });

                                 this.setState({
                                     locationOpened: null
                                 });
                             }}/>

                {this.spAnimationContainer()}
                <Toast
                    style={{margin: 15}}
                    position='top'
                    ref={(toast) => {
                        this.toast = toast;
                    }}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    levelSelectorContainer: {
        height: 50,
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#000"
    },
    container: {
        flex: 1,
        backgroundColor: HEADER
    },
    webView: {
        backgroundColor: BGWASH,
        width: "100%",
        flex: 1
    },
    spAnimationContainer: {
        height: 120,
        bottom: 0,
        position: "absolute",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        backgroundColor: "#d5d5d5",
        shadowOpacity: 0.6,
        shadowRadius: 4,
        elevation: 3,
        padding: 15,
        flexDirection: "row"
    },
    locationWordsText: {
        textAlign: "center",
        marginLeft: 15,
        marginRight: 15,
        alignSelf: "center",
        flex: 1
    },
    imageUpDown: {
        width: 48,
        height: 48,
        resizeMode: "contain"
    }
});

const mapStateToProps = (state) => {
    const {payload} = state.main;
    const {sp} = state.floor;
    const {visited, live} = state.beacon;
    const {enabled} = state.bluetooth;
    const {mall} = payload;

    if (payload !== null) {
        this.data = payload.floors.map((floor) => {
            let levelIdentifier;
            if (floor.no <= -1) {
                levelIdentifier = `KE${floor.no * -1}`;
            }
            else {
                levelIdentifier = `K${floor.no}_`;
            }
            let floorData = {
                id: `level-${floor.no}`,
                no: floor.no,
                mapWidth: floor.dimension.width,
                mapHeight: floor.dimension.height,
                title: `MechanicMap-${floor.no}`,
                map: floor.svg,
                initialScaleFactor: floor.scale,
                locations: payload.stores.reduce((stores, store) => {
                    store.locations.forEach((location) => {
                        if (location.s.substring(0, 3) === levelIdentifier) {
                            stores.push({
                                id: location.s,
                                type: "store",
                                title: store.name["en"],
                                image_url: store.logo,
                                rawData: store,
                                category: store.categories.length > 0 ? store.categories[0].s : ""
                            });
                        }
                    });
                    return stores;
                }, [])
                    .concat(
                        payload.services.reduce((services, service) => {
                            service.locations.forEach((location) => {
                                if (location.s.substring(0, 3) === levelIdentifier) {
                                    services.push({
                                        id: location.s,
                                        type: "service",
                                        title: service.name["en"],
                                        image_url: service.image,
                                        rawData: service
                                    });
                                }
                            });
                            return services;
                        }, [])
                    )
            };
            if (floor.no === 0) {
                floorData.show = true;
            }
            return floorData;
        });

        this.data.sort((a, b) => {
            if (a.no < b.no) {
                return -1;
            }
            if (a.no > b.no) {
                return 1;
            }
        });

        const categories = payload.categories.map((category) => {
            return {
                slug: category._id,
                color: category.color
            };
        });

        return {
            levels: this.data,
            categories: categories,
            sp,
            visitedBeacons: visited,
            liveBeacon: live,
            bluetooth: enabled,
            mall
        };
    }

    return {
        levels: null,
        categories: null,
        sp,
        visitedBeacons: visited,
        liveBeacon: live,
        bluetooth: enabled,
        mall
    };
};

MallMap.propTypes = {
    BeaconParkingSpot: PropTypes.func,
    VisitedLocationShowed: PropTypes.func,
    NewSP: PropTypes.func,
    ActionBluetoothPermission: PropTypes.func,
    permissionIsGranted: PropTypes.func,
    BeaconParkingRequest: PropTypes.func,
    BeaconVisitedRequest: PropTypes.func,
    resetSP: PropTypes.func,
    navigation: PropTypes.instanceOf(Object),
    mall: PropTypes.instanceOf(Object),
    levels: PropTypes.instanceOf(Array),
    categories: PropTypes.instanceOf(Array),
    visitedBeacons: PropTypes.instanceOf(Array),
    liveBeacon: PropTypes.instanceOf(Array),
    sp: PropTypes.oneOfType([
        PropTypes.instanceOf(Object),
        PropTypes.bool
    ]),
    bluetooth: PropTypes.bool
};

const MallMapRedux = connect(mapStateToProps, {
    NewSP,
    BeaconVisitedRequest,
    VisitedLocationShowed,
    ActionBluetoothPermission,
    permissionIsGranted,
    resetSP,
    BeaconParkingRequest,
    BeaconParkingSpot
})(MallMap);

export {MallMapRedux as MallMap};

