import React from "react";
import {connect} from "react-redux";
import {translateText} from "../../translation/translate";
import OptimizedFlatList from "../../components/common/OptimizedFlatList";
import {TouchableOpacity, View} from "react-native";
import {CachedImage} from "react-native-img-cache";
import CategoryListItem from "../../components/stores/CategoryListItem";


class CafeRestaurants extends React.Component {
    static navigationOptions = ({navigation}) => ({
            title: translateText('CafeRestaurants').toUpperCase(),
            headerLeft: <TouchableOpacity onPress={() => navigation.navigate('DrawerOpen')}>
                <CachedImage source={require("../../../assets/icons/menu-icon.png")}
                             style={{width: 20, height: 20, margin: 15}}
                />
            </TouchableOpacity>
        }
    );

    constructor(props) {
        super(props);
        this._renderItem = this._renderItem.bind(this);
    }

    _filterBySubCategory = (id) => {
        return this.props.category.stores.filter((store) => store.categories.filter(category => category['s'] == id).length > 0)
    };

    _renderItem = ({item}) => {
        return (
            <CategoryListItem item={item} onPress={() => {
                this.props.navigation.navigate('StoresList', {
                    stores: this._filterBySubCategory(item['_id']),
                    title: item.name
                })
            }}/>
        );
    }

    render() {
        return (
            <View>
                <OptimizedFlatList
                    renderItem={this._renderItem}
                    data={this.props.category.subcategories}
                    keyExtractor={(item, key) => key.toString()}
                    style={styles.rootContainer}
                />
            </View>
        )
    };
}

const styles = {
    rootContainer: {
        paddingLeft: 15,
        paddingRight: 15,
        height: '100%'
    },
    cardContainer: {
        backgroundColor: '#fff',
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
    },
    container: {
        padding: 10
    },
    buttonStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textStyle: {
        fontSize: 13
    }
};

const mapStateToProps = (state) => {
    const {payload} = state.main;
    const {user} = state.auth;
    if (payload !== null) {
        let {categories} = payload;
        let st = payload.stores;
        let c = categories.filter((category) => category['_id'] === '2')[0];
        c.stores = [...st.filter((store) => {
            if (user !== null && user.isLoggedIn) {
                let match = user["favorite_stores"].find(function (obj) {
                    return obj['s'] === store['_id'];
                });
                store['fav'] = !!match;
                store['userid'] = user['_id'];
            }
            return store.categories.filter(category => {
                return c.subcategories.filter(e => e['_id'] == category['s']).length > 0
            }).length > 0
        })];
        return {category: c}
    }
    return {category: []};
};

const CafeRestaurantsRedux = connect(mapStateToProps)(CafeRestaurants);

export {CafeRestaurantsRedux as CafeRestaurants};