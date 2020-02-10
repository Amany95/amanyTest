/* eslint-disable react/no-deprecated */
import React from "react";
import {connect} from "react-redux";
import {FlatList} from "react-native";
import PropTypes from "prop-types";
import _ from "lodash";

import CategoryListItem from "../../components/stores/CategoryListItem";
import {getDefaultLanguageText} from "../../translation/translate";

class CategoryListScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        const {state} = navigation;
        return {
            title: `${state.params.title}`.toUpperCase()
        };
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            filteredCategory: this.props.categories
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.searchTerm !== this.props.searchTerm) {
            this.filterCategories(nextProps.searchTerm);
        }
    }

    filterCategories = (searchTerm) => {
        this.setState({
            filteredCategory: searchTerm !== "" ? _.cloneDeep(this.props.categories).filter((category) => {
                return category.name["en"].toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
            }) : this.props.categories
        })
    };
    onPressedCard = (item) => {
        if (!item.subcategories) {
            this.props.navigation.navigate("StoresList", {
                stores: item.stores,
                title: getDefaultLanguageText(item.name)
            });
        }
        else {
            this.props.navigation.navigate("StoresListSubCategory", {
                data: item,
                title: getDefaultLanguageText(item.name)
            });
        }
    };

    _renderItem({item}) {
        return (
            <CategoryListItem item={item} onPress={() => {
                return this.onPressedCard(item)
            }}/>
        )
    }

    render() {
        // // console.log("this.state.filteredCategory", this.state.filteredCategory);
        return (
            <FlatList data={this.state.filteredCategory}
                      keyExtractor={(item, key) => {
                          return key.toString()
                      }}
                      renderItem={this._renderItem.bind(this)}
                      style={styles.container}
            />
        );
    }
}

const styles = {
    container: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 15
    }
};

const mapStateToProps = (state) => {
    const {payload} = state.main;
    const {user} = state.auth;
    let parentCategories;

    if (payload !== null) {
        let {categories} = payload;
        let st = payload.stores;

        categories.sort((a, b) => {
            return getDefaultLanguageText(a.name).localeCompare(getDefaultLanguageText(b.name), "ar")
        });

        parentCategories = categories.filter((category) => {
            return !category.is_subcategory
        });

        parentCategories.forEach((c) => {
            let subCategories = categories.filter((category) => {
                return category.parent_category === c["_id"]
            });

            if (subCategories.length === 0) {
                c.stores = [...st.filter((store) => {
                    if (user !== null && user.isLoggedIn) {
                        let match = user["favorite_stores"].find((obj) => {
                            return obj["s"] === store["_id"];
                        });
                        store["fav"] = !!match;
                        store["userid"] = user["_id"];
                    }

                    return store.categories.filter((category) => {
                        return c["_id"] === category["s"]
                    }).length > 0
                })];
            }
            else {
                c.subcategories = subCategories
            }
        });
        return {categories: parentCategories}
    }
    return {categories: []};
};

CategoryListScreen.propTypes = {
    navigation: PropTypes.instanceOf(Object),
    searchTerm: PropTypes.string,
    categories: PropTypes.instanceOf(Array)
};

export default connect(mapStateToProps)(CategoryListScreen);
