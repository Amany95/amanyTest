/* eslint-disable camelcase */
import React from "react";
import {translateText} from "../../translation/translate";
import {SearchView} from "../../components/common";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {connect} from "react-redux";
import PropTypes from "prop-types";

import config from "../../../config/config";
import {CachedImage} from "react-native-img-cache";
import ScrollableTabView from "react-native-scrollable-tab-view";
import {DefaultTabBar} from "../../components/common/DefaultTabBar";
import StoreListScreen from "../stores/StoreListScreen";
import {Services} from "../";

class WayfinderStoreList extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: translateText(navigation.state.params.title).toUpperCase()
        };
    };

    _renderYourLocationButton() {
        const {selectionActive} = this.props.navigation.state.params;

        if (selectionActive !== "from") {
            return null;
        }

        return (<TouchableOpacity
            activeOpacity={0.7}
            style={{
                justifyContent: "center",
                flexDirection: "row",
                padding: 6,
                opacity: config().beaconMode ? 1 : 0.7
            }}

            onPress={() => {
                if (config().beaconMode) {
                    this.props.navigation.state.params.returnData({
                        type: "beacons"
                    });
                    this.props.navigation.goBack();
                }
            }}>

            <CachedImage style={{width: 30, height: 30, resizeMode: "contain"}}
                         source={require("../../../assets/icons/bluetooth_location.png")}/>
            <Text style={styles.yourLocationText}>{translateText("your_location")}</Text>
        </TouchableOpacity>)
    }

    _renderParkingSpotButton() {
        const {parking_location} = this.props.navigation.state.params;

        if (!this.props.parkingSpot || parking_location) {
            return null;
        }

        return (<TouchableOpacity
            activeOpacity={0.7}
            style={{
                justifyContent: "center",
                flexDirection: "row",
                padding: 6
            }}

            onPress={() => {
                this.props.navigation.state.params.returnData({
                    type: "parking"
                });
                this.props.navigation.goBack();
            }}>

            <CachedImage style={{width: 30, height: 30, resizeMode: "contain"}}
                         source={require("../../../assets/icons/wayfinder_park_icon.png")}/>
            <Text style={styles.yourLocationText}>{translateText("parking_location")}</Text>
        </TouchableOpacity>)
    }

    constructor(props, context) {
        super(props, context);
        this.state = {
            searchTerm: "",
            locations: null,
            item: null
        };
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#fff"}}>
                <SearchView
                    onChange={(searchTerm) => {
                        this.setState({searchTerm});
                    }}
                    value={this.state.searchTerm}
                    style={styles.searchInput}
                    placeholder={translateText("Search")}
                    placeholderTextColor={"#000"}
                />
                <View style={{width: "100%", flexDirection: "row", justifyContent: "center"}}>
                    {this._renderYourLocationButton()}
                    {this._renderParkingSpotButton()}
                </View>
                <ScrollableTabView
                    scrollWithoutAnimation={true}
                    onChangeTab={() => {
                        this.setState({
                            searchTerm: ""
                        })
                    }}
                    renderTabBar={() => {
                        return (<DefaultTabBar
                            underlineStyle={styles.underlineStyle}
                            textStyle={styles.labelStyle}
                            style={styles.tab}
                            tabStyle={styles.tabBar}
                            activeTextColor={config().BASE_SECOND_COLOR}
                            activeBorderColor={config().BASE_SECOND_COLOR}
                            inactiveBorderColor='#ccc'
                            inactiveTextColor='#ccc'
                        />)
                    }}>

                    <StoreListScreen key='atoz'
                                     tabLabel={translateText("a_z")}
                                     navigation={this.props.navigation}
                                     searchTerm={this.state.searchTerm}
                                     wayfinderList
                    />

                    <Services key='services'
                              tabLabel={translateText("Services")}
                              navigation={this.props.navigation}
                              searchTerm={this.state.searchTerm}
                              wayfinderList
                    />

                </ScrollableTabView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    searchInput: {
        padding: 10,
        borderColor: "#999",
        borderBottomWidth: 1,
        fontWeight: "bold",
        fontSize: 15,
        height: 40
    },
    tabBar: {
        backgroundColor: "transparent",
        borderWidth: StyleSheet.hairlineWidth,
        height: 30
    },
    indicator: {
        backgroundColor: "transparent"
    },
    labelStyle: {
        fontSize: 14
    },
    underlineStyle: {
        backgroundColor: "transparent"
    },
    tab: {
        borderWidth: 0,
        marginLeft: 8,
        marginRight: 8,
        height: "auto"
    },
    yourLocationText: {
        fontSize: 18,
        color: config().BASE_SECOND_COLOR
    }
});

WayfinderStoreList.propTypes = {
    navigation: PropTypes.instanceOf(Object),
    parkingSpot: PropTypes.instanceOf(Array)
};

const mapStateToProps = ({beacon}) => {
    return {
        parkingSpot: beacon.parking
    };
};

const WayfinderStoreListRedux = connect(mapStateToProps)(WayfinderStoreList);
export {WayfinderStoreListRedux as WayfinderStoreList};
