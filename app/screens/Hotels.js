import React from "react";
import {connect} from "react-redux";
import {TouchableOpacity, View} from "react-native";
import {CachedImage} from "react-native-img-cache";
import {translateText} from "../translation/translate";
import {StoresList} from "./stores/StoresList";


class Hotels extends React.Component {
    static navigationOptions = ({navigation}) => {
        const {state} = navigation;
        if (state.params && state.params.type === 'REPLACE')
            return {
                title: translateText('Hotels').toUpperCase(),
                headerLeft: <TouchableOpacity onPress={() => navigation.navigate('DrawerOpen')}>
                    <CachedImage source={require("../../assets/icons/menu-icon.png")}
                                 style={{width: 20, height: 20, margin: 15}}
                    />
                </TouchableOpacity>
            };
        return {
            title: translateText('Hotels').toUpperCase(),
        };
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{
                height: '100%',
                backgroundColor: '#fff'
            }}>
                <StoresList hotel_stores={this.props.stores} navigation={this.props.navigation}/>
            </View>
        )
    };
}

const mapStateToProps = ({main, auth}) => {
    const {payload} = main;
    const {user} = auth;
    const {hotel_categories} = payload.mall;

    if (payload !== null) {
        let st = payload.stores;
        const stores = st.filter((store) => {
            if (user !== null && user.isLoggedIn) {
                let match = user["favorite_stores"].find(function (obj) {
                    return obj['s'] === store['_id'];
                });
                store['fav'] = !!match;
                store['userid'] = user['_id'];
            }

            return hotel_categories.filter((hotel_category) => {
                return store.categories.filter(store_category => store_category.s === hotel_category.s).length > 0
            }).length > 0
        });

        return {stores: stores}
    }
    return {stores: []};
};

const HotelsRedux = connect(mapStateToProps)(Hotels);

export {HotelsRedux as Hotels};