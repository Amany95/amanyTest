import React from "react";
import {
    Alert,
    Platform,
    RefreshControl,
    ScrollView,
    Text,
    TouchableNativeFeedback,
    TouchableOpacity,
    View,
    Dimensions
} from "react-native";
import PropTypes from "prop-types";
import {CachedImage} from "react-native-img-cache";
import Swiper from "react-native-swiper";
import {connect} from "react-redux";
import ScrollableTabView, {DefaultTabBar} from "react-native-scrollable-tab-view";
import {NavigationActions} from "react-navigation";
import Share from "react-native-share";
import timer from "react-native-timer";

import {Button, Card} from "../components/common";
import {translateText} from "../translation/translate";
import Normalize from "../utils/Normalize";
import config, {mobileAppURL} from "../../config/config";
import {setLocale} from "../actions/i18n";
import {checkServer} from "../actions/Main";

import {ActionBluetoothPermission , permissionIsGranted} from "../actions/Bluetooth";
import {
    BeaconParkingRequest,
    BeaconParkingSpot,
    BeaconVisitedRequest,
    VisitedLocationShowed,
    emergencyBtn
} from "../actions/Beacon";

import Loader from "../components/common/Loader";


// import {checkBeaconAndBluetooth,checkBluetooth} from "../utils/Emergency";

const {width} = Dimensions.get("window");
const defaultBoxHeight = 140;

class Home extends React.Component {
    
    static navigationOptions = ({navigation, screenProps}) => {
        return {
            title: translateText("Citystars").toUpperCase(),
            headerTitleStyle: {
                alignSelf: "center"
            },
            headerLeft:
                <View style={{flexDirection: "row"}}>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("DrawerOpen");
                    }}>
                        <CachedImage source={require("../../assets/icons/menu-icon.png")}
                                     style={{width: 20, height: 20, margin: 15}}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {

                        Share.open({
                            title: "Citystars Heliopolis",
                            message: "Citystars Heliopolis",
                            url: mobileAppURL
                        }).catch(() => {
                        });
                    }}>
                        <CachedImage source={require("../../assets/icons/share_icon.png")}
                                     resizeMode={"contain"}
                                     style={{width: 20, height: 20, margin: 15}}
                        />
                    </TouchableOpacity>
                </View>,
            headerRight: <View style={{flexDirection: "row"}}>
                <TouchableOpacity onPress={() => {
                    screenProps.setLocale(screenProps.locale === "en" ? "ar" : "en");
                    navigation.dispatch(
                        NavigationActions.reset({
                            index: 0,
                            actions: [NavigationActions.navigate({routeName: "Home"})]
                        })
                    );
                }}>
                    <Text style={styles.translateText}>{translateText("EN")}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    navigation.navigate("Profile");
                }}>
                    <CachedImage source={require("../../assets/icons/profile_icon.png")}
                                 resizeMode={"contain"}
                                 style={{width: 20, height: 20, margin: 15}}
                    />
                </TouchableOpacity>
            </View>
        };
    };

    componentWillUnmount() {
        timer.clearTimeout(this);
        // if (this.userLocationNotFoundALongTime) {
        //     clearInterval(this.userLocationNotFoundALongTime);
        // }
    }

    state = {
        delayShowScrollTabView: false,
        refreshing: false,
        loading: false
        
    };

    _onRefresh() {
        this.setState({refreshing: true});
        this.props.checkServer().then(() => {
            this.setState({refreshing: false});
        });
    }

    componentDidMount() {
        timer.setTimeout(this, "showTabView", () => {
            this.setState({
                delayShowScrollTabView: true
            });
        }, 1500);
    }
    componentWillReceiveProps(nextProps) {
        console.log("in will recive ");

        if (nextProps.liveBeacon) {
            console.log("in if visited ")

            if (this.props.bluetooth && this.state.loading && nextProps.liveBeacon.length > 0) {
                this.setState({
                    loading: false
                });
                console.log(" in will recieve in blutooth & load");
                console.log(nextProps.liveBeacon);

                const minorBeacon=nextProps.liveBeacon[0].minor;
                console.log("minorrr**********");
                console.log(minorBeacon);
                this.props.emergencyBtn({beacon_minor:minorBeacon});

            }

        }
    }

    visitedBeacon = () => {
        if (this.props.liveBeacon && this.props.liveBeacon.length > 0) {
            if (!this.state.parkingMode) {
                this.props.BeaconVisitedRequest(this.props.liveBeacon);
            }
        }
    };
    
    locationNotFound = () => {
        console.log("in fun location not found");
        if (this.state.loading) {
            console.log("in fun location not found in if");

            this.setState({
                loading: false
            }, () => {
                setTimeout(() => {
                    Alert.alert(translateText("error"), translateText("location_failed"));
                }, 1000);
            });
        }

        if (this.props.liveBeacon && this.props.liveBeacon.length === 0) {
            console.log("in fun location not found in if 2222222222222");
            console.log(this.props.liveBeacon);
            const minor=this.props.liveBeacon[0].minor;
            this.props.emergencyBtn({beacon_minor:minor});
        }
    };

    componentWillMount() { 
        if (config().beaconMode) {
            this.userLocationWithBeacon = setInterval(this.visitedBeacon, 5000);

            // this.userLocationNotFoundALongTime = setInterval(this.locationNotFound, 15000);
        }
    }

    isShowUserLocationMap = () => {
        return !!(config().beaconMode && this.props.bluetooth);
    };

    render() {
        console.log('props os Home **************')
        console.log(this.props);

        return (
            
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        title={translateText("loading")}
                        titleColor={"#868686"}
                        onRefresh={this._onRefresh.bind(this)}
                    />
                }
            >
                <Card style={styles.cardStyle}>
                    <Button style={styles.buttonStyle} onPress={() => {
                        this.props.navigation.navigate("Brands");
                    }}>
                        <View style={styles.cardSectionStyle}>
                            <CachedImage style={styles.backgroundImage}
                                         source={require("../../assets/images/directory_bg.png")}/>
                            <CachedImage source={require("../../assets/icons/directory.png")}/>
                            <Text
                                style={styles.cardTitleStyle}>{translateText("Directory").toUpperCase()}</Text>
                        </View>
                    </Button>
                    <Button style={styles.buttonStyle} onPress={() => {
                        this.props.navigation.navigate("CinemaStores");
                    }}>
                        <View style={styles.cardSectionStyle}>
                            <CachedImage style={styles.backgroundImage}
                                         source={require("../../assets/images/cinema_bg.png")}/>
                            <CachedImage source={require("../../assets/icons/cinema.png")}/>
                            <Text
                                style={styles.cardTitleStyle}>{translateText("Cinema").toUpperCase()}</Text>
                        </View>
                    </Button>
                </Card>

                <ScrollableTabView
                    locked={true}
                    style={{height:  (width / 1.78) + 40, flex: 1}}
                    initialPage={0}
                    scrollWithoutAnimation={true}
                    tabBarUnderlineStyle={{height: 5, backgroundColor: config().DEFAULT_BUTTON_HIGHLIGHT_COLOR}}
                    renderTabBar={() => {
                        return <DefaultTabBar
                            style={{height: 35, paddingBottom: 4}}
                            renderTab={(name, page, isTabActive, onPressHandler) => {
                                const textColor = isTabActive ? config().DEFAULT_BUTTON_HIGHLIGHT_COLOR : "#292E31";
                                const fontWeight = isTabActive ? "bold" : "normal";
                                const itemCount = page === 0 ? this.props.offers.length : page === 1 ? this.props.whatsNews.length : this.props.events.length;
                                return <TouchableOpacity
                                    style={{flex: 1}}
                                    key={name}
                                    accessible={true}
                                    accessibilityLabel={name}
                                    delayPressIn={0}
                                    background={Platform.OS === "android" && TouchableNativeFeedback.SelectableBackground()}
                                    accessibilityTraits='button'
                                    onPress={() => {
                                        return onPressHandler(page);
                                    }}
                                >
                                    <View style={styles.tab}>
                                        <Text style={[{color: textColor, fontWeight}, styles.textStyle]}>
                                            {name}
                                        </Text>
                                        {!!itemCount &&
                                        <View style={[styles.tabCountContainer, {backgroundColor: textColor}]}>
                                            <Text style={styles.tabCountText}>{itemCount}</Text>
                                        </View>}
                                    </View>
                                </TouchableOpacity>;
                            }}
                        />;
                    }}>
                    <View style={[styles.cardStyle, {height: width / 1.78}]}
                          key={"offers"}
                          tabLabel={translateText("Offers").toUpperCase()}>
                        {this.state.delayShowScrollTabView && <Swiper showsButtons={this.props.offers.length > 1}
                                                                      showsPagination={false}
                                                                      loadMinimal={true}
                                                                      autoplay={false}
                                                                      loop={false}
                                                                      onScrollBeginDrag={() => {
                                                                          this.setState({
                                                                              beginDrag: true
                                                                          });
                                                                      }}
                                                                      nextButton={<CachedImage style={styles.arrowIcon}
                                                                                               source={require("../../assets/icons/home-right-arrow.png")}/>}
                                                                      prevButton={<CachedImage style={styles.arrowIcon}
                                                                                               source={require("../../assets/icons/home-left-arrow.png")}/>}>
                            {this.props.offers.length > 0 ? this.props.offers.map((offer) => {
                                return (
                                    <View key={offer["_id"]} style={styles.slide3}>
                                        <TouchableOpacity style={{height: "100%", width: "100%"}}
                                                          activeOpacity={0.9}
                                                          onPress={() => {
                                                              const navigateAction = NavigationActions.navigate({
                                                                  routeName: "Offers"
                                                              });

                                                              if (!this.state.beginDrag) {
                                                                  this.props.navigation.dispatch(navigateAction);
                                                              }

                                                              else {
                                                                  this.setState({
                                                                      beginDrag: false
                                                                  });
                                                              }
                                                          }}>

                                            <CachedImage style={{height: "100%", width: "100%"}}
                                                         defaultSource={require("../../assets/images/placeholder_store.png")}
                                                         source={{uri: offer.image}}/>
                                        </TouchableOpacity>
                                    </View>
                                );
                            }) : <View style={styles.slide3}>
                                <CachedImage style={{height: "100%", width: "100%"}}
                                             source={require("../../assets/images/placeholder_store.png")}/>
                            </View>}
                        </Swiper>}
                    </View>
                    <View style={[styles.cardStyle, {height: width / 1.78}]}
                          tabLabel={translateText("WhatsNews").toUpperCase()}
                          key='whatsnew'>
                        <Swiper showsButtons={this.props.whatsNews.length > 1}
                                showsPagination={false}
                                loadMinimal={true}
                                autoplay={false}
                                loop={false}
                                onScrollBeginDrag={() => {
                                    this.setState({
                                        beginDrag: true
                                    });
                                }}
                                nextButton={<CachedImage style={styles.arrowIcon}
                                                         source={require("../../assets/icons/home-right-arrow.png")}/>}
                                prevButton={<CachedImage style={styles.arrowIcon}
                                                         source={require("../../assets/icons/home-left-arrow.png")}/>}>
                            {this.props.whatsNews.length > 0 ? this.props.whatsNews.map((whatsNew) => {
                                return (
                                    <View key={whatsNew["_id"]}>
                                        <TouchableOpacity style={{height: "100%", width: "100%"}}
                                                          activeOpacity={0.9}
                                                          onPress={() => {
                                                              const navigateAction = NavigationActions.navigate({
                                                                  routeName: "WhatsNews"
                                                              });

                                                              if (!this.state.beginDrag) {
                                                                  this.props.navigation.dispatch(navigateAction);
                                                              }
                                                              else {
                                                                  this.setState({
                                                                      beginDrag: false
                                                                  });
                                                              }
                                                          }}>
                                            <CachedImage style={{height: "100%", width: "100%"}}
                                                         defaultSource={require("../../assets/images/placeholder_store.png")}
                                                         source={{uri: whatsNew.image}}/>
                                        </TouchableOpacity>
                                    </View>
                                );
                            }) : <View style={styles.slide3}>
                                <CachedImage style={{height: "100%", width: "100%"}}
                                             source={require("../../assets/images/placeholder_store.png")}/>
                            </View>}
                        </Swiper>
                    </View>
                    <View style={[styles.cardStyle, {height: width / 1.78}]}
                          tabLabel={translateText("Events").toUpperCase()}
                          key={"events"}>
                        <Swiper showsButtons={this.props.events.length > 1}
                                showsPagination={false}
                                loadMinimal={true}
                                autoplay={false}
                                loop={false}
                                onScrollBeginDrag={() => {
                                    this.setState({
                                        beginDrag: true
                                    });
                                }}
                                nextButton={<CachedImage style={styles.arrowIcon}
                                                         source={require("../../assets/icons/home-right-arrow.png")}/>}
                                prevButton={<CachedImage style={styles.arrowIcon}
                                                         source={require("../../assets/icons/home-left-arrow.png")}/>}>

                            {this.props.events.length > 0 ? this.props.events.map((event) => {
                                return (
                                    <View key={event["_id"]}>
                                        <TouchableOpacity style={{height: "100%", width: "100%"}} activeOpacity={0.9}
                                                          onPress={() => {
                                                              const navigateAction = NavigationActions.navigate({
                                                                  routeName: "Events"
                                                              });

                                                              if (!this.state.beginDrag) {
                                                                  this.props.navigation.dispatch(navigateAction);
                                                              }
                                                              else {
                                                                  this.setState({
                                                                      beginDrag: false
                                                                  });
                                                              }
                                                          }}>
                                            <CachedImage style={{height: "100%", width: "100%"}}
                                                         defaultSource={require("../../assets/images/placeholder_store.png")}
                                                         source={{uri: event.image}}/>
                                        </TouchableOpacity>
                                    </View>
                                );
                            }) : <View style={styles.slide3}>
                                <CachedImage style={{height: "100%", width: "100%"}}
                                             source={require("../../assets/images/placeholder_store.png")}/>
                            </View>}
                        </Swiper>
                    </View>
                </ScrollableTabView>

                <Card style={styles.cardStyle}>
                    <Button style={styles.buttonStyle} onPress={() => {
                        this.props.navigation.navigate("Fashion");
                    }}>
                        <View style={styles.cardSectionStyle}>
                            <CachedImage style={styles.backgroundImage}
                                         source={require("../../assets/images/fashion_bg.png")}/>

                            <CachedImage source={require("../../assets/icons/fashion.png")}/>
                            <Text style={styles.cardTitleStyle}>{translateText("Fashion").toUpperCase()}</Text>
                        </View>
                    </Button>

                    <Button style={styles.buttonStyle} onPress={() => {
                        this.props.navigation.navigate("Dining");
                    }}>
                        <View style={styles.cardSectionStyle}>

                            <CachedImage style={styles.backgroundImage}
                                         source={require("../../assets/images/dining_bg.png")}/>

                            <CachedImage source={require("../../assets/icons/dining.png")}/>
                            <Text style={styles.cardTitleStyle}>{translateText("Dining").toUpperCase()}</Text>

                        </View>
                    </Button>

                    <Button style={styles.buttonStyle} onPress={() => {
                        this.props.navigation.navigate("Entertainment");
                    }}>
                        <View style={styles.cardSectionStyle}>
                            <CachedImage style={styles.backgroundImage}
                                         source={require("../../assets/images/entertainment_bg.png")}/>

                            <CachedImage source={require("../../assets/icons/entertainment.png")}/>
                            <Text style={styles.cardTitleStyle}>{translateText("Entertainment").toUpperCase()}</Text>
                        </View>
                    </Button>
                </Card>

                <Card style={styles.cardStyle}>
                    <Button style={styles.buttonStyle} onPress={() => {
                        this.props.navigation.navigate("Wayfinder");
                    }}>
                        <View style={styles.cardSectionStyle}>
                            <CachedImage style={styles.backgroundImage}
                                         source={require("../../assets/images/wayfinder_bg.png")}/>
                            <CachedImage source={require("../../assets/icons/wayfinder.png")}/>
                            <Text
                                style={styles.cardTitleStyle}>{translateText("Wayfinder").toUpperCase()}</Text>
                        </View>
                    </Button>

                    <Button style={styles.buttonStyle} onPress={() => {
                        this.props.navigation.navigate("MallMap");
                    }}>
                        <View style={styles.cardSectionStyle}>
                            <CachedImage style={styles.backgroundImage}
                                         source={require("../../assets/images/mallmap_bg.png")}/>

                            <CachedImage source={require("../../assets/icons/mallmap.png")}/>
                            <Text
                                style={styles.cardTitleStyle}>{translateText("MallMap").toUpperCase()}</Text>
                        </View>
                    </Button>
                    <Button style={styles.buttonStyle} onPress={() => {
                        this.props.navigation.navigate("Parking");
                    }}>
                        <View style={styles.cardSectionStyle}>
                            <CachedImage style={styles.backgroundImage}
                                         source={require("../../assets/images/parking_bg.png")}/>

                            <CachedImage source={require("../../assets/icons/parking.png")}/>
                            <Text
                                style={styles.cardTitleStyle}>{translateText("Parking").toUpperCase()}</Text>
                        </View>
                    </Button>
                </Card>

                <Card style={styles.cardStyle}>
                    <Button style={styles.buttonStyle_hotel} onPress={() => {
                        this.props.navigation.navigate("Hotels");
                    }}>
                        <View style={styles.cardSectionStyle}>
                            <CachedImage style={styles.backgroundImage}
                                         source={require("../../assets/images/hotel_bg.png")}/>

                            <CachedImage source={require("../../assets/icons/hotel.png")}/>
                            <Text
                                style={styles.cardTitleStyle}>{translateText("Hotels").toUpperCase()}</Text>
                        </View>
                    </Button>
                    <Button style={styles.buttonStyle_office} onPress={() => {
                        this.props.navigation.navigate("Offices");
                    }}>
                        <View style={styles.cardSectionStyle}>
                            <CachedImage style={styles.backgroundImage}
                                         source={require("../../assets/images/startscapital_bg.png")}/>

                            <CachedImage source={require("../../assets/icons/startscapital.png")}/>
                            <Text
                                style={styles.cardTitleStyle}>{translateText("Offices").toUpperCase()}</Text>
                        </View>
                    </Button>
                </Card>

                <Card style={styles.cardStyle}>
                    <Button style={styles.buttonStyle} onPress={() => {
                        this.props.navigation.navigate("ContactUs");
                    }}>
                        <View style={styles.cardSectionStyle}>
                            <CachedImage style={styles.backgroundImage}
                                         source={require("../../assets/images/contactus_bg.png")}/>

                            <CachedImage source={require("../../assets/icons/contactus.png")}/>
                            <Text
                                style={styles.cardTitleStyle}>{translateText("ContactUs").toUpperCase()}</Text>
                        </View>
                    </Button>

                    <Button style={styles.buttonStyle} onPress={() => {
                        this.props.navigation.navigate("Services");
                    }}>
                        <View style={styles.cardSectionStyle}>
                            <CachedImage style={styles.backgroundImage}
                                         source={require("../../assets/images/services_bg.png")}/>

                            <CachedImage source={require("../../assets/icons/services.png")}/>
                            <Text style={styles.cardTitleStyle}>{translateText("Services").toUpperCase()}</Text>
                        </View>
                    </Button>

                    <Button style={styles.buttonStyle} onPress={() => {
                        this.props.navigation.navigate("AboutUs");
                    }}>
                        <View style={styles.cardSectionStyle}>
                            <CachedImage style={styles.backgroundImage}
                                         source={require("../../assets/images/aboutus_bg.png")}/>

                            <CachedImage source={require("../../assets/icons/aboutus.png")}/>
                            <Text style={styles.cardTitleStyle}>{translateText("AboutUs").toUpperCase()}</Text>
                        </View>
                    </Button>
                </Card>
                <Card style={styles.cardStyle}>
                    <Button style={styles.buttonStyle_Emergency} onPress={() => {
                        // this.props.navigation.navigate("Emergency");
                        // ActionBluetoothPermission();
                        Alert.alert(
                            "Emergency Button",
                            "When You press on emergency button , an immediate call directly to the Security guard",
                            [
                              {
                                text: "Cancel",
                                onPress: () => console.log("cancel"),
                                style: "cancel"
                              },
                              {text: "OK", onPress: () => {
                                if (this.isShowUserLocationMap()) {
                                    console.log("in show user");
                                    console.log(this.props.liveBeacon);

                                    if (this.props.liveBeacon && this.props.liveBeacon.length > 0 && this.props.bluetooth) {
                                        console.log("in live beacons");

                                        const minor=this.props.liveBeacon[0].minor;
                                        this.props.emergencyBtn({beacon_minor:minor});
                                        
                                    
                                    }
                                    else {
                                        console.log("if else in show user");

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
                                        console.log("no bluetooth");

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
                                 
                              } 
                        

                            }
                            ],
                            {cancelable: false},
                          );

                    }}>
                        <View style={styles.cardSectionStyle}>
                            <CachedImage style={styles.backgroundImage}
                                         source={require("../../assets/images/contactus_bg.png")}/>

                            <CachedImage source={require("../../assets/icons/icons8-police-64.png")}/>
                            {/* icons8-police-64.png" */}
                            <Text
                                style={styles.cardTitleStyle}>{translateText("Emergency").toUpperCase()}</Text>


                    <Loader loading={this.state.loading} title={translateText("detecting_your_location")}
                                            onRequestClose={() => {
                                                this.setState({loading: false});
                                            }}/>
                        </View>
                    </Button>

                </Card>
            </ScrollView>
        );
    }
}

const styles = {
    arrowIcon: {
        width: 30,
        height: 30,
        resizeMode: "contain"
    },
    cardStyle: {
        height: defaultBoxHeight,
        flexDirection: "row",
        width: "100%",
        flex: 1
    },
    backgroundImage: {
        backgroundColor: "#ccc",
        resizeMode: "cover",
        position: "absolute",
        width: "100%",
        height: "100%",
        justifyContent: "center"
    },
    cardSectionStyle: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: defaultBoxHeight
    },
    cardTitleStyle: {
        backgroundColor: "transparent",
        color: "#fff",
        fontSize: Normalize(18),
        marginTop: 5,
        textAlign: "center"
    },
    slide3: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    },
    buttonStyle: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#fff"
    },
    buttonStyle_hotel: {
        flex: 2,
        borderWidth: 1,
        borderColor: "#fff"
    },
    buttonStyle_office: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#fff"
    },
    translateText: {
        color: "#fff",
        padding: 15
    },
    textStyle: {fontWeight: "800"},
    tab: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row"
    },
    tabCountText: {
        fontSize: 11,
        color: "#fff"
    },
    tabCountContainer: {
        backgroundColor: "#292E31",
        borderRadius: 16,
        height: 16,
        width: 16,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 6,
        marginLeft: 6
    },
    buttonStyle_Emergency: {
        flex: 3,
        borderWidth: 1,
        borderColor: "#fff"
    }
};

Home.propTypes = {
    navigation: PropTypes.instanceOf(Object),
    events: PropTypes.instanceOf(Object),
    whatsNews: PropTypes.instanceOf(Object),
    offers: PropTypes.instanceOf(Object),
    checkServer: PropTypes.func,

    ActionBluetoothPermission: PropTypes.func,
    permissionIsGranted: PropTypes.func,
    bluetooth: PropTypes.bool,
    mall: PropTypes.instanceOf(Object),
    liveBeacon: PropTypes.instanceOf(Array),
    emergencyBtn:PropTypes.func,
    visitedBeacons: PropTypes.instanceOf(Array),
    BeaconVisitedRequest: PropTypes.func,






};

const mapStateToProps = (state) => {
    const {payload} = state.main;
    const {enabled} = state.bluetooth;
    const {live} = state.beacon;

    const {mall} = payload;
    console.log("test mapStateTpProps in Home*********");
    console.log(mall);

    /** @namespace payload.events */
    /** @namespace payload.promotions */
    /** @namespace payload.news */

    return {
        currentLocale: state.i18n.locale,
        events: payload && payload.events,
        offers: payload && payload.promotions,
        whatsNews: payload && payload.news,
        bluetooth: enabled,
        mall,
        liveBeacon: live

    };
};

const HomeRedux = connect(mapStateToProps, {setLocale, checkServer,
    ActionBluetoothPermission,
    permissionIsGranted,
    emergencyBtn,
    BeaconVisitedRequest

})(Home);

export {HomeRedux as Home};

