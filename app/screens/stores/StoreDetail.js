import React from "react";
import {ScrollView, StyleSheet, Text, View} from "react-native";
import Communications from "react-native-communications";
import {favoriteAction} from "../../actions/Favorite";
import {connect} from "react-redux";
import {CachedImage} from "react-native-img-cache";
import {getDefaultLanguageText, translateText} from "../../translation/translate";
import {Button} from "../../components/common";
import config from "../../../config/config";
import {FavButton} from "../../components/buttons";
import ModalSelector from "../../components/common/modal/ModalSelector";
import Toast, {DURATION} from "react-native-easy-toast";
import AutoHeightWebView from "../../components/common/AutoHeightWebView";
import Share from "react-native-share";
import PropTypes from "prop-types";

class StoreDetail extends React.Component {
    static navigationOptions = ({navigation}) => {
        const {state} = navigation;

        return {
            title: `${getDefaultLanguageText(state.params.title)}`.toUpperCase()
        };
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            height: 0
        };
    }

    selectLocationMallMap = (data) => {
        if (data.locations.length <= 1) {
            return (
                <View style={styles.FAVButtonContainerStyle}>
                    <Button style={styles.rippleButtonStyle}
                            onPress={() => {
                                if (data.locations.length === 0) {
                                    if (this.toast) {
                                        this.toast.show("Location not found.", DURATION.LENGTH_LONG);
                                    }
                                }
                                else {
                                    this.props.navigation.navigate("MallMap", {
                                        locationOpen: data.locations[0].s,
                                        locationType: "store"
                                    });
                                }
                            }}>
                        <View style={{flexDirection: "row", alignSelf: "center"}}>
                            <CachedImage source={require("../../../assets/icons/ic_land_show_map.png")}
                                         resizeMode={"contain"}
                                         style={{width: 16, height: 18, resizeMode: "contain"}}/>
                            <Text style={styles.locationMallMapText}>{translateText("show_on_map")}</Text>
                        </View>
                    </Button>
                </View>
            );
        }

        const locations = data.locations.map((location) => {
            let floor = location.s.substring(0, location.s.indexOf("_store_"));
            let extra = floor.length === 3 ? "-" : "";
            return {
                key: location.s,
                label: `${translateText("Floor") } + ${extra}${floor[floor.length - 1]}`
            };
        });
        return (
            <View style={styles.FAVButtonContainerStyle}>
                <ModalSelector
                    data={locations}
                    style={{flex: 1}}
                    cancelText={translateText("Cancel")}
                    buttonStyle={styles.rippleButtonStyle}
                    onChange={(option) => {
                        this.props.navigation.navigate("MallMap", {
                            locationOpen: option.key,
                            locationType: "store"
                        });
                    }}>
                    <View style={{flexDirection: "row", alignSelf: "center"}}>
                        <CachedImage source={require("../../../assets/icons/ic_land_show_map.png")}
                                     resizeMode={"contain"}
                                     style={{width: 16, height: 16, resizeMode: "contain"}}/>
                        <Text style={styles.locationMallMapText}>{translateText("show_on_map")}</Text>
                    </View>
                </ModalSelector>
            </View>
        );
    };

    selectLocationWayfinder = (data) => {
        if (data.locations.length <= 1) {
            return (
                <Button style={styles.buttonStyle} onPress={() => {

                    if (data.locations.length === 0) {
                        if (this.toast) {
                            this.toast.show("Location not found.", DURATION.LENGTH_SHORT);
                        }
                    }
                    else {
                        this.props.navigation.navigate("Wayfinder", {
                            to: {
                                id: data.locations[0].s,
                                type: "store",
                                title: data.name,
                                image_url: data.logo,
                                rawData: data
                            }
                        });
                    }
                }}>
                    <Text style={styles.button}>{translateText("Wayfinder").toUpperCase()}</Text>
                </Button>
            );
        }

        const locations = data.locations.map((location) => {
            let floor = location.s.substring(0, location.s.indexOf("_store_"));
            let extra = floor.length === 3 ? "-" : "";

            return {
                key: location.s,
                label: `${translateText("Floor") } + ${extra}${floor[floor.length - 1]}`
            };
        });
        return (
            <ModalSelector
                data={locations}
                style={styles.buttonStyle}
                cancelText={translateText("Cancel")}
                onChange={(option) => {
                    this.props.navigation.navigate("Wayfinder", {
                        to: {
                            id: option.key,
                            type: "store",
                            title: data.name,
                            image_url: data.logo,
                            rawData: data
                        }
                    });
                }}>
                <Text style={styles.button}>{translateText("Wayfinder").toUpperCase()}</Text>
            </ModalSelector>
        );
    };

    render() {
        const {data} = this.props.navigation.state.params;

        return (
            <View style={{flex: 1}}>
                <ScrollView style={{flex: 1, backgroundColor: "#fff"}}>
                    <View style={{width: "100%", height: 220}}>
                        {data.facade !== "" ? <CachedImage style={styles.facade}
                                                           defaultSource={require("../../../assets/images/placeholder_store.png")}
                                                           source={{uri: data.facade}}
                        /> : <CachedImage style={styles.facade}
                                          source={require("../../../assets/images/placeholder_store.png")}/>}
                        {this.selectLocationMallMap(data)}
                    </View>
                    <View style={styles.container}>
                        <View style={{flexDirection: "row"}}>
                            <CachedImage source={{uri: data.logo}}
                                         style={styles.imageLogo}/>
                            <View style={{justifyContent: "center", padding: 10, flex: 1}}>
                                <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                                    <Text numberOfLines={1}
                                          style={styles.title}>{getDefaultLanguageText(data.name)}</Text>
                                    <FavButton
                                        buttonStyle={{marginRight: -12}}
                                        fav={data.fav}
                                        onPress={() => {
                                            this.props.favoriteAction({
                                                userid: data["userid"],
                                                isFav: data["fav"],
                                                item_id: data["_id"],
                                                item_type: "favorite_stores"
                                            });
                                        }}/>
                                </View>

                                <View style={styles.floorContainer}>
                                    <CachedImage style={{width: 11, height: 11, marginRight: 4}}
                                                 source={require("../../../assets/icons/store_map_icon.png")}/>
                                    <Text style={styles.floorText}
                                          numberOfLines={1}>{getDefaultLanguageText(data.floor_names)}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View>
                            <View style={styles.buttonGroup}>
                                <Button style={styles.buttonStyle}
                                        onPress={() => {
                                            if (data.phone !== "") {
                                                Communications.phonecall(data.phone, false);
                                            }
                                            else if (data.phone === "" && this.toast) {
                                                this.toast.show("Phone number not found.", DURATION.LENGTH_LONG);
                                            }
                                        }}>
                                    <Text style={[styles.button, {color: data.phone === "" ? "#999999" : "#fff"}]}>
                                        {translateText("Call").toUpperCase()}</Text>
                                </Button>
                                <Button style={styles.buttonStyle}
                                        onPress={() => {
                                            // send to email
                                            if (data.email !== "") {
                                                Communications.email([data.email], null, null, "", "");
                                            }
                                            else if (data.phone === "" && this.toast) {
                                                this.toast.show("Email address not found.", DURATION.LENGTH_LONG);
                                            }
                                        }}>
                                    <Text style={[styles.button, {color: data.email === "" ? "#999999" : "#fff"}]}>
                                        {translateText("Email").toUpperCase()}</Text>
                                </Button>
                                <Button style={styles.buttonStyle}
                                        onPress={() => {
                                            // go to website
                                            if (data.web !== "") {
                                                Communications.web(data.web);
                                            }
                                            else if (data.phone === "" && this.toast) {
                                                this.toast.show("Web address not found.", DURATION.LENGTH_LONG);
                                            }
                                        }}>
                                    <Text style={[styles.button, {color: data.web === "" ? "#999999" : "#fff"}]}>
                                        {translateText("Website").toUpperCase()}</Text>
                                </Button>
                            </View>
                            <View style={styles.buttonGroup}>
                                {this.selectLocationWayfinder(data)}
                                <Button style={styles.buttonStyle}
                                        onPress={() => {
                                            if (data.gallery.length !== 0) {
                                                this.props.navigation.navigate("StoreImageGallery", {
                                                    gallery_photos: data.gallery,
                                                    title: "Gallery"
                                                });
                                            }
                                            else if (data.gallery.length === 0 && this.toast) {
                                                this.toast.show("Gallery not found.", DURATION.LENGTH_LONG);
                                            }
                                        }}>
                                    <Text
                                        style={[styles.button, {color: data.gallery.length === 0 ? "#999999" : "#fff"}]}>
                                        {translateText("Gallery").toUpperCase()}</Text>
                                </Button>
                                <Button style={styles.buttonStyle}
                                        onPress={() => {
                                            // share store
                                            if (data.url !== "") {
                                                Share.open({
                                                    title: getDefaultLanguageText(data.name),
                                                    message: getDefaultLanguageText(data.name),
                                                    url: getDefaultLanguageText(data.url)
                                                });
                                            }
                                            else if (data.url !== "" && this.toast) {
                                                this.toast.show("Store url not found.", DURATION.LENGTH_LONG);
                                            }
                                        }}>
                                    <Text style={[styles.button, {color: data.url === "" ? "#999999" : "#fff"}]}>
                                        {translateText("Share").toUpperCase()}</Text>
                                </Button>
                            </View>
                            <View style={styles.buttonGroup}>
                                <Button style={styles.buttonStyle}
                                        onPress={() => {
                                            if (data.virtual_tour !== "") {
                                                this.props.navigation.navigate("Browser", {
                                                    uri: data.virtual_tour,
                                                    title: "Virtual Tour"
                                                });
                                            }
                                        }}>
                                    <Text
                                        style={[styles.button, {color: data.virtual_tour === "" ? "#999999" : "#fff"}]}>
                                        {translateText("VirtualTour").toUpperCase()}</Text>
                                </Button>
                            </View>
                        </View>
                        <Toast ref={(toast) => {
                            this.toast = toast;
                        }}/>
                    </View>
                    <AutoHeightWebView
                        navigation={this.props.navigation}
                        defaultUrl={data.explanation}
                    />
                </ScrollView>
            </View>
        );
    }
}

StoreDetail.propTypes = {
    navigation: PropTypes.object,
    favoriteAction: PropTypes.func
};

const styles = {
    container: {
        padding: 15,
        flex: 1,
        backgroundColor: "#fff"
    },
    facade: {
        resizeMode: "cover",
        width: "100%",
        height: 220
    },
    imageLogo: {
        resizeMode: "contain",
        width: 64,
        height: 64,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#999"
    },
    logoContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    button: {
        color: "#fff",
        width: "100%",
        textAlign: "center",
        fontSize: 14,
        fontWeight: "300",
        paddingTop: 10,
        paddingBottom: 10

    },
    buttonStyle: {
        flex: 1,
        backgroundColor: "#222",
        margin: 4
    },
    buttonGroup: {
        justifyContent: "space-around",
        flexDirection: "row",
        marginTop: 3
    },
    tagButtonStyle: {
        height: 36,
        borderRadius: 3,
        backgroundColor: "#dfdfde"
    },
    title: {
        fontWeight: "bold",
        fontSize: 20,
        marginBottom: 5,
        maxWidth: "90%",
        color: "#000"
    },
    floorText: {
        fontSize: 14,
        fontWeight: "600",
        color: config().DEFAULT_BUTTON_HIGHLIGHT_COLOR
    },
    floorContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    rippleButtonStyle: {
        width: 120,
        height: 40,
        backgroundColor: "#000",
        opacity: 0.8,
        alignItems: "center",
        justifyContent: "center"
    },
    locationMallMapText: {
        color: "#fff"
    },
    FAVButtonContainerStyle: {
        right: 0,
        top: 180,
        zIndex: 1,
        position: "absolute"
    }
};

const mapStateToProps = (state) => {
    return state;
};

const StoreDetailRedux = connect(mapStateToProps, {
    favoriteAction
})(StoreDetail);

export {StoreDetailRedux as StoreDetail};
