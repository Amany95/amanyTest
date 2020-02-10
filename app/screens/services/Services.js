import React, {Component} from "react";
import {Text, TouchableOpacity, View} from "react-native";
import OptimizedFlatList from "../../components/common/OptimizedFlatList";
import {connect} from "react-redux";
import {getDefaultLanguageText, translateText} from "../../translation/translate";
import {CachedImage} from "react-native-img-cache";
import Toast from "react-native-easy-toast";
import ModalSelector from "../../components/common/modal/ModalSelector";

class Services extends Component {
    static defaultProps = {
        wayfinderList: false
    };

    static navigationOptions = ({navigation}) => {
        const {state} = navigation;
        if (state.params && state.params.type === "REPLACE") {
            return {
                title: translateText("Services").toUpperCase(),
                headerLeft: <TouchableOpacity onPress={() => {
                    return navigation.navigate("DrawerOpen")
                }}>
                    <CachedImage source={require("../../../assets/icons/menu-icon.png")}
                                 style={{width: 20, height: 20, margin: 15}}
                    />
                </TouchableOpacity>
            };
        }
        return {
            title: translateText("Services").toUpperCase()
        };
    };

    state = {
        locations: null,
        item: null
    };
    _itemButton = (item) => {
        if (item.hint.includes("category@")) {
            this.props.navigation.navigate("StoresList", {
                stores: this.props.stores.filter((store) => {
                    return store.categories.filter((category) => {
                        return category.s === item.hint.split("@")[1]
                    }).length > 0
                }),
                title: item.name
            });
            return;
        }

        this.props.navigation.navigate("ServiceDetail", {
            data: item,
            title: item.name
        })
    };
    _wayfinderItem = (service) => {
        const item = {
            id: service["_id"],
            type: "service",
            title: service.name,
            image_url: service.image,
            floor_names: service.floor_names,
            rawData: service
        };

        const locations = item.rawData.locations.map((location) => {
            let floor = location.s.substring(0, location.s.indexOf("_"))
            let extra = floor.length === 3 ? "-" : "";

            return {
                key: location.s,
                label: `${translateText("Floor") } ${ extra }${floor[floor.length - 1]}`
            }
        });

        if (locations.length > 1) {
            this.setState({
                locations,
                item
            }, () => {
                this.modal.open();
            });
        }
        else if (locations.length === 1) {
            item["id"] = item.rawData.locations[0].s;
            this.props.navigation.state.params.returnData(item);
            this.props.navigation.goBack();
        }
    };
    renderItem = ({item}) => {
        if (item) {
            return (
                <TouchableOpacity style={styles.itemButton}
                                  onPress={() => {
                                      this.props.wayfinderList ? this._wayfinderItem(item) : this._itemButton(item)
                                  }}>
                    <View style={{flexDirection: "row", alignItems: "center", width: "70%"}}>
                        <CachedImage
                            source={{uri: item.image}} style={{resizeMode: "contain", width: 40, height: 40}}
                        />
                        <Text numberOfLines={1} style={styles.itemText}>{getDefaultLanguageText(item.name)}</Text>
                    </View>
                    <CachedImage source={require("../../../assets/icons/ic_right_arrow.png")}/>
                </TouchableOpacity>
            )
        }
    };

    componentWillMount() {
        let services = this.props.services;
        if (this.props.wayfinderList) {
            services = services.filter((item) => {
                return !item.hint.includes("category@")
            })
        }

        this.setState({services});
    }

    render() {

        return (
            <View style={{height: "100%"}}>
                <OptimizedFlatList
                    style={{height: "100%"}}
                    data={this.state.services}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => {
                        return index.toString()
                    }}
                />

                <ModalSelector
                    ref={(modal) => {
                        this.modal = modal
                    }}
                    cancelText={translateText("Cancel")}
                    data={this.state.locations}
                    onChange={(option) => {
                        let data = this.state.item;
                        data["id"] = option.key;
                        this.props.navigation.state.params.returnData(data);
                        this.props.navigation.goBack();
                    }}
                />

                <Toast ref={(toast) => {
                    this.toast = toast;
                }}/>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    const {payload} = state.main;
    if (payload !== null) {
        return {
            services: payload.services,
            stores: payload.stores
        }
    }

    return {services: null};
};

const styles = {
    itemButton: {
        marginRight: 16,
        marginLeft: 16,
        paddingTop: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderColor: "#eee",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    itemText: {
        fontSize: 18,
        marginLeft: 15
    }
};

const ServicesRedux = connect(mapStateToProps)(Services);

export {ServicesRedux as Services}
