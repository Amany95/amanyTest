/* eslint-disable react/no-deprecated */
import React, {Component} from "react";
import {connect} from "react-redux";
import {facebookLogin, loginUser, logoutUser, saveProfilePhoto} from "../../actions/Profile";
import Login from "./Login";
import {Alert, Text, TouchableOpacity, View} from "react-native";
import ListItem from "../../components/stores/ListItem";
import {favoriteAction} from "../../actions/Favorite";
import {CachedImage} from "react-native-img-cache";
import ImagePicker from "react-native-image-picker";
import {Button, GridView} from "../../components/common";
import {translateText} from "../../translation/translate";
import ScrollableTabView from "react-native-scrollable-tab-view";
import {EventListItem} from "../../components/events";
import {OfferListItem} from "../../components/offers/OfferListItem";
import config from "../../../config/config";
import {DefaultTabBar} from "../../components/common/DefaultTabBar";
import OptimizedFlatList from "../../components/common/OptimizedFlatList";
import PropTypes from "prop-types";

const email_filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;

class Profile extends Component {
    static navigationOptions = ({navigation}) => {
        const {state} = navigation;

        if (state.params && state.params.type === "REPLACE") {
            return {
                title: state.params && state.params.user ? translateText("Profile").toUpperCase() : translateText("Login").toUpperCase(),
                headerLeft:
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("DrawerOpen");
                    }}>
                        <CachedImage source={require("../../../assets/icons/menu-icon.png")}
                                     style={{width: 20, height: 20, margin: 15}}
                        />
                    </TouchableOpacity>,
                headerRight: state.params && state.params.user ?
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("Notifications");
                    }}>
                        <CachedImage source={require("../../../assets/icons/notification.png")}
                                     style={{width: 20, height: 20, margin: 15}}
                        />
                    </TouchableOpacity>
                    : null
            };
        }
        return {
            title: state.params && state.params.user ? translateText("Profile").toUpperCase() : translateText("Login").toUpperCase(),
            headerRight: state.params && state.params.user ?
                <TouchableOpacity onPress={() => {
                    navigation.navigate("Notifications");
                }}>
                    <CachedImage source={require("../../../assets/icons/notification.png")}
                                 style={{width: 20, height: 20, margin: 15}}
                    />
                </TouchableOpacity>
                : null
        };
    };

    constructor(props) {
        super(props);
        this._renderItem = this._renderItem.bind(this);
    }

    componentDidMount() {
        const {user} = this.props;

        if (user !== null && Object.keys(user).length > 0) {
            this.props.navigation.setParams({user: true});
        }
        else {
            this.props.navigation.setParams({user: false});
        }
    }

    componentWillReceiveProps(nextProps) {
        const {user} = this.props;

        if (user !== nextProps.user) {
            if (nextProps.user !== null) {
                this.props.navigation.setParams({user: true});
            }
            else {
                this.props.navigation.setParams({user: false});
            }
        }
    }

    state = {
        email: "",
        password: "",
        email_error: [],
        password_error: []
    };

    _renderItem(item, key) {
        if (key === "stores") {
            return (
                <ListItem item={item} key={item["_id"]} onPressFav={() => {
                    this.props.favoriteAction({
                        userid: item["userid"],
                        isFav: item["fav"],
                        item_id: item["_id"],
                        item_type: "favorite_stores"
                    });
                }} onPress={() => {
                    this.props.navigation.navigate("StoreDetail", {
                        data: item,
                        title: item.name
                    });
                }}/>
            );
        }
        else if (key === "events") {
            return (
                <EventListItem event={item} onPressFav={() => {
                    this.props.favoriteAction({
                        userid: item["userid"],
                        isFav: item["fav"],
                        item_id: item["_id"],
                        item_type: "favorite_events"
                    });
                }} onPress={() => {
                    this.props.navigation.navigate("EventDetail", {
                        event: item,
                        title: item.title
                    });
                }}/>
            );
        }
        else if (key === "offers") {
            return (
                <OfferListItem offer={item} onPressFav={() => {
                    this.props.favoriteAction({
                        userid: item["userid"],
                        isFav: item["fav"],
                        item_id: item["_id"],
                        item_type: "favorite_offers"
                    });
                }} onPress={() => {
                    this.props.navigation.navigate("OfferDetail", {
                        offer: item,
                        title: item.title
                    });
                }}/>
            );
        }
        else if (key === "whatsnew") {
            return (
                <OfferListItem offer={item} onPressFav={() => {
                    this.props.favoriteAction({
                        userid: item["userid"],
                        isFav: item["fav"],
                        item_id: item["_id"],
                        item_type: "favorite_news"
                    });
                }} onPress={() => {
                    this.props.navigation.navigate("WhatsNewDetail", {
                        whatsNew: item,
                        title: item.title
                    });
                }}/>
            );
        }
    }

    fieldChanged = (text) => {
        this.setState(text);
    };

    render() {
        const {user} = this.props;

        if (user && user.isLoggedIn) {

            return (
                <View style={{height: "100%"}}>
                    <View style={{padding: 15, paddingBottom: 0}}>
                        <View style={{
                            flexDirection: "row",
                            height: 100
                        }}>
                            <Button onPress={() => {
                                const options = {
                                    quality: 1.0,
                                    maxWidth: 500,
                                    maxHeight: 500,
                                    storageOptions: {
                                        skipBackup: true
                                    }
                                };

                                ImagePicker.showImagePicker(options, (response) => {
                                    if (!response.didCancel && !response.error && !response.customButton) {
                                        this.props.saveProfilePhoto(user._id, response);
                                    }
                                });
                            }}
                                    activeOpacity={0.8}
                                    style={{width: 100}}
                            >
                                <CachedImage source={{uri: user["profile_picture"]}}
                                             defaultSource={require("../../../assets/images/anonymous_user.png")}
                                             style={{resizeMode: "cover", width: 100, height: 100}}/>
                            </Button>
                            <View style={{marginLeft: 15, justifyContent: "center", flex: 1}}>
                                <Text
                                    style={{
                                        fontSize: 18
                                    }}>{`${user["name"] } ${ user["surname"]}`}</Text>

                                <Button
                                    onPress={() => {
                                        this.props.navigation.navigate("QrIdentity");
                                    }}
                                    activeOpacity={0.8}
                                    style={[styles.defaultButton, {marginTop: 5}]}>
                                    <Text style={styles.defaultText}>{translateText("MyQrIdentity")}</Text>
                                </Button>

                                <View style={{
                                    flexDirection: "row",
                                    marginTop: 10,
                                    alignItems: "center",
                                    justifyContent: "space-between"
                                }}>
                                    <Button
                                        onPress={() => {
                                            this.props.navigation.navigate("UpdateProfile");
                                        }}
                                        activeOpacity={0.8}
                                        style={[styles.defaultButton, {flex: 1}]}>
                                        <Text style={styles.defaultText}>{translateText("Edit")}</Text>
                                    </Button>
                                    <Button
                                        onPress={() => {

                                            this.props.logoutUser(user._id);
                                        }}
                                        style={[styles.defaultButton, {flex: 1}]}>
                                        <Text style={styles.defaultText}>{translateText("Logout")}</Text>
                                    </Button>
                                </View>
                            </View>
                        </View>
                        <View style={{
                            alignSelf: "center",
                            marginTop: 15
                        }}>
                            <Text style={{
                                fontSize: 21,
                                fontWeight: "400",
                                color: "#959595"
                            }}>{translateText("Favorites").toUpperCase()}</Text>
                        </View>
                    </View>

                    <ScrollableTabView
                        style={{height: "100%"}}
                        renderTabBar={() => {
                            return (
                                <DefaultTabBar
                                    textStyle={styles.textStyle}
                                    style={styles.tabBar}
                                    underlineStyle={{backgroundColor: config().BASE_COLOR}}
                                />
                            );
                        }}>

                        <OptimizedFlatList
                            key='stores'
                            tabLabel={translateText("Brands").toUpperCase()}
                            keyExtractor={(item, key) => {
                                return key.toString()
                            }}
                            data={this.props.stores}
                            renderItem={(data) => {
                                return this._renderItem(data.item, "stores");
                            }}
                        />

                        <GridView
                            itemsPerRow={2}
                            key='events'
                            tabLabel={translateText("Events").toUpperCase()}
                            items={this.props.events}
                            renderItem={(item) => {
                                return this._renderItem(item, "events");
                            }}
                        />

                        <GridView
                            key='offers'
                            itemsPerRow={2}
                            tabLabel={translateText("Offers").toUpperCase()}
                            items={this.props.offers}
                            renderItem={(item) => {
                                return this._renderItem(item, "offers");
                            }}
                        />

                        <GridView
                            key='whatsnew'
                            itemsPerRow={2}
                            tabLabel={translateText("WhatsNews").toUpperCase()}
                            items={this.props.whatsNews}
                            renderItem={(item) => {
                                return this._renderItem(item, "whatsnew");
                            }}
                        />

                    </ScrollableTabView>
                </View>
            );
        }

        return (
            <Login {...this.state} navigation={this.props.navigation} onChange={this.fieldChanged}
                   emailLogin={() => {
                       let errorText = "";

                       if (this.state.password === "") {
                           errorText = translateText("empty_value");
                       }
                       if (!email_filter.test(this.state.email)) {
                           if (errorText === "") {
                               errorText = translateText("email_not_valid");
                           }
                       }

                       if (errorText !== "") {
                           Alert.alert(translateText("error"), errorText);
                       }
                       else {
                           this.props.loginUser({
                               email: this.state.email,
                               password: this.state.password
                           });
                       }

                   }} facebookLogin={() => {
                this.props.facebookLogin();
            }}/>
        );
    }
}

const styles = {
    headerContainer: {
        marginTop: 15,
        marginBottom: 15
    },
    defaultText: {
        fontSize: 13,
        color: "#555",
        alignSelf: "center"
    },
    defaultButton: {
        borderColor: "#555",
        borderWidth: 1,
        padding: 5,
        marginRight: 8,
        height: 30
    },
    textStyle: {
        color: config().BASE_COLOR,
        fontSize: 12
    },
    tabBar: {
        padding: 15
    }
};

const mapStateToProps = ({auth, main}) => {
    const {user, facebookLogin} = auth;
    const {payload} = main;

    if (user && user.isLoggedIn) {

        let stores = [];
        payload.stores.forEach((store) => {
            let match = user["favorite_stores"].find((obj) => {
                return obj.s === store._id;
            });

            store["fav"] = !!match;
            store["userid"] = user["_id"];

            if (match) {
                stores.push(store);
            }

        });
        let events = [];

        payload.events.forEach((event) => {
            let match = user["favorite_events"].find((obj) => {
                return obj.s === event._id;
            });

            event["fav"] = !!match;
            event["userid"] = user["_id"];

            if (match) {
                events.push(event);
            }

        });

        let offers = [];
        payload.promotions.forEach((promotion) => {
            let match = user["favorite_offers"].find((obj) => {
                return obj["s"] === promotion["_id"];
            });

            promotion["fav"] = !!match;
            promotion["userid"] = user["_id"];

            if (match) {
                offers.push(promotion);
            }

            return false;
        });

        let whatsNews = [];
        payload.news.forEach((whatsNew) => {
            let match = user["favorite_news"].find((obj) => {
                return obj["s"] === whatsNew["_id"];
            });

            whatsNew["fav"] = !!match;
            whatsNew["userid"] = user["_id"];

            if (match) {
                whatsNews.push(whatsNew);
            }

            return false;
        });

        return {
            user: user,
            stores: stores,
            events: events,
            offers: offers,
            whatsNews: whatsNews,
            newFacebookLogin: facebookLogin
        };
    }

    return {user: auth.user, newFacebookLogin: facebookLogin};
};

Profile.propTypes = {
    navigation: PropTypes.instanceOf(Object),
    favoriteAction: PropTypes.func,
    facebookLogin: PropTypes.func,
    loginUser: PropTypes.func,
    logoutUser: PropTypes.func,
    saveProfilePhoto: PropTypes.func,
    stores: PropTypes.instanceOf(Array),
    events: PropTypes.instanceOf(Array),
    offers: PropTypes.instanceOf(Array),
    whatsNews: PropTypes.instanceOf(Array),
    user: PropTypes.instanceOf(Object)
};

const ProfileRedux = connect(mapStateToProps, {
    loginUser, logoutUser, favoriteAction, saveProfilePhoto, facebookLogin
})(Profile);

export {ProfileRedux as Profile};
