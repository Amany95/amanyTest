/* eslint-disable react/no-deprecated */
import React from "react";
import {
    InteractionManager,
    SafeAreaView,
    SectionList,
    View
} from "react-native";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import sectionListGetItemLayout from "react-native-section-list-get-item-layout";
import _ from "lodash";

import ListHeader from "../../components/stores/ListHeader";
import {getDefaultLanguageText, translateText} from "../../translation/translate";
import {filterStores} from "../../actions/Stores";
import ListItem from "../../components/stores/ListItem";
import ModalSelector from "../../components/common/modal/ModalSelector";
import AlphabetPicker from "../../components/common/ATOZListView/AlphabetPicker";
import {Indicator} from "../../components/common/Indicator";

class StoreListScreen extends React.PureComponent {
    constructor(props) {
        super(props);
        this._renderContent = this._renderContent.bind(this);
        this.state = {
            filteredStores: this.props.stores,
            renderPlaceholderOnly: true,
            alphabet: this.props.stores.map((object) => {
                return object.title;
            }),
            legacyImplementation: true,
            section: "A",
            loading: false
        };

        this.debounceChange = _.debounce(this.filterStores, 500, {leading: true});

        this.getItemLayout = sectionListGetItemLayout({
            getItemHeight: () => {
                return 85
            },
            getSeparatorHeight: () => {
                return 0
            }, // The height of your separators
            getSectionHeaderHeight: () => {
                return 33
            }, // The height of your section headers
            getSectionFooterHeight: () => {
                return 0
            }, // The height of your section footers
            listHeaderHeight: 0 // The height of your list header
        });
    }

    componentWillUpdate(nextProps) {
        if (nextProps.searchTerm !== this.props.searchTerm) {
            this.setState({
                loading: true
            }, () => {
                this.debounceChange(nextProps.searchTerm);
            });

        }
    }

    componentWillMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({renderPlaceholderOnly: false});
        });

        if (this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.notification) {
            const {data} = this.props.navigation.state.params;
            let navigateStore = {};

            this.props.stores.filter((storeArray) => {
                storeArray.data.filter((store) => {
                    const isTrue = store._id === data;
                    if (isTrue) {
                        navigateStore = store;
                    }
                    return isTrue;
                });
            });

            this.props.navigation.navigate("StoreDetail", {
                data: navigateStore,
                title: navigateStore.name
            });
        }
    }

    filterStores = (searchTerm) => {
        if (typeof searchTerm.toLowerCase !== "function") {
            return;
        }

        const filteredStores = _.filter(this.props.stores, (store) => {
            store.data = _.filter(this.props.storeList, (st) => {
                if (store.title !== getDefaultLanguageText(st.name).charAt(0).toUpperCase()) {
                    return false;
                }

                const nameContains = getDefaultLanguageText(st.name).toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
                const tagContains = getDefaultLanguageText(st.tag).toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
                return nameContains || tagContains;
            });
            return store.data.length > 0;
        });

        this.setState({
            alphabet: filteredStores.map((object) => {
                return object.title;
            }),
            filteredStores,
            loading: false
        });
    };

    _renderItem = ({item}) => {
        return (
            <ListItem
                item={item}
                firstItemSection
                onPress={() => {
                    if (this.props.wayfinderList) {
                        this._wayfinderItem(item);
                        return;
                    }

                    this.props.navigation.navigate("StoreDetail", {data: item, title: item.name});
                }}/>
        );
    };

    _renderHeader = ({section}) => {

        if (section) {
            return (
                <ListHeader section={section}/>
            );
        }
    };

    _wayfinderItem = (store) => {
        const item = {
            id: store["_id"],
            type: "store",
            title: store.name,
            image_url: store.logo,
            floor_names: store.floor_names,
            rawData: store
        };

        const locations = item.rawData.locations.map((location) => {
            let floor = location.s.substring(0, location.s.indexOf("_"));
            let extra = floor.length === 3 ? "-" : "";

            return {
                key: location.s,
                label: `${translateText("Floor")} ${extra} ${floor[floor.length - 1]}`
            };
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

    _onTouchLetter = (letter) => {
        if (this.tempLetter === letter) {
            return;
        }

        this.tempLetter = letter;
        this.setState({
            section: letter,
            legacyImplementation: false
        });

        this.root.scrollToLocation({
            sectionIndex: this.state.alphabet.indexOf(letter),
            itemIndex: 0,
            animated: false,
            viewPosition: 0
        });
    };

    _renderContent = () => {

        return (
            <View style={{height: "100%", width: "100%", flexDirection: "row"}}>

                <SectionList
                    ref={(root) => {
                        this.root = root;
                    }}
                    sections={this.state.filteredStores}
                    renderItem={this._renderItem}
                    extraData={this.props.searchTerm}
                    renderSectionHeader={this._renderHeader}
                    style={{
                        flex: 1,
                        marginRight: 25
                    }}
                    keyExtractor={(item) => {
                        return item._id
                    }}
                    initialNumToRender={8}
                    removeClippedSubviews={true}
                    getItemLayout={this.getItemLayout}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                />
                <SafeAreaView style={{
                    position: "absolute",
                    backgroundColor: "transparent",
                    top: 0,
                    bottom: 0,
                    right: 0,
                    justifyContent: "center",
                    alignItems: "center"
                }}
                >
                    <AlphabetPicker alphabet={this.state.alphabet} onTouchLetter={this._onTouchLetter}/>

                </SafeAreaView>
                <ModalSelector
                    ref={(modal) => {
                        this.modal = modal;
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
            </View>
        );
    };

    render() {
        if (!this.state.renderPlaceholderOnly && !this.state.loading) {
            return this._renderContent();
        }

        return (
            <Indicator/>
        );
    }
}

StoreListScreen.propTypes = {
    navigation: PropTypes.instanceOf(Object),
    stores: PropTypes.instanceOf(Array),
    searchTerm: PropTypes.string
};

const mapStateToProps = (state) => {
    const {payload} = state.main;
    const {user} = state.auth;

    if (payload !== null) {
        let data = payload.stores;
        let newArray = [];
        data.forEach((object) => {
            if (user !== null && user.isLoggedIn) {
                let match = user["favorite_stores"].find((obj) => {
                    return obj["s"] === object["_id"];
                });
                object["fav"] = !!match;
                object["userid"] = user["_id"];
            }
            else {
                object["fav"] = false;
                object["userid"] = null;
            }

            if (newArray.filter((datas) => {
                if (datas.title === getDefaultLanguageText(object.name).charAt(0).toUpperCase()) {
                    datas.data.push(object);
                    return true;
                }
                return false;
            }).length === 0) {
                newArray.push({
                    data: [object],
                    title: getDefaultLanguageText(object.name).charAt(0).toUpperCase()
                });
            }
        });

        newArray.sort((a, b) => {
            return a.title.localeCompare(b.title);
        });
        return {stores: newArray, user, data, storeList: payload.stores};
    }

    return {stores: [], user: null, storeList: payload.stores};
};

export default connect(mapStateToProps, {filterStores})(StoreListScreen);
