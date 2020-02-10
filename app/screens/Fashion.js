import React from "react";
import {connect} from "react-redux";
import {TouchableOpacity, View} from "react-native";
import {CachedImage} from "react-native-img-cache";
import OptimizedFlatList from "../components/common/OptimizedFlatList";
import {getDefaultLanguageText, translateText} from "../translation/translate";
import ParentCategoryItem from "../components/stores/ParentCategoryItem";

class Fashion extends React.Component {
    static navigationOptions = ({navigation}) => {
        const {state} = navigation;
        if (state.params && state.params.type === "REPLACE")
            return {
                title: translateText("Fashion").toUpperCase(),
                headerLeft: <TouchableOpacity onPress={() => navigation.navigate("DrawerOpen")}>
                    <CachedImage source={require("../../assets/icons/menu-icon.png")}
                                 style={{width: 20, height: 20, margin: 15}}
                    />
                </TouchableOpacity>
            };
        return {
            title: translateText("Fashion").toUpperCase()
        };
    };

    constructor(props) {
        super(props);
        this._renderItem = this._renderItem.bind(this);
    }

    _renderItem = ({item}) => {
        return (
            <ParentCategoryItem item={item} onPress={() => {
                this.props.navigation.navigate("StoresList", {
                    stores: item.stores,
                    title: item.name
                })
            }}/>
        );
    }

    render() {
        return (
            <View style={{
                height: "100%"
            }}>
                <OptimizedFlatList
                    renderItem={this._renderItem}
                    data={this.props.category}
                    keyExtractor={(item, key) => key.toString()}
                    style={styles.rootContainer}
                />
            </View>
        )
    }
}

const styles = {
    rootContainer: {
        paddingLeft: 15,
        paddingRight: 15,
        height: "100%"
    }
};

const mapStateToProps = ({main, auth}) => {
    const {payload} = main;
    const {user} = auth;
    const {fashion_categories} = payload.mall;

    if (payload !== null) {
        let {categories} = payload;
        let st = payload.stores;

        let c = categories.filter((category) => {
            let isFashion = fashion_categories.filter((fashion_category) => {
                return fashion_category.s === category["_id"]
            }).length > 0;

            if (isFashion) {
                category.stores = [
                    ...st.filter((store) => {
                        if (user !== null && user.isLoggedIn) {
                            let match = user["favorite_stores"].find(function (obj) {
                                return obj["s"] === store["_id"];
                            });
                            store["fav"] = !!match;
                            store["userid"] = user["_id"];
                        }

                        return store.categories.filter(scategory => {
                            return category["_id"] === scategory["s"]
                        }).length > 0
                    })
                ];
            }
            return isFashion
        });
        c.sort((a, b) => getDefaultLanguageText(a.name).localeCompare(getDefaultLanguageText(b.name), "ar"));

        return {category: c}
    }
    return {category: []};
};

const FashionRedux = connect(mapStateToProps)(Fashion);

export {FashionRedux as Fashion};