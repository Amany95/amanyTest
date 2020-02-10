import React from "react";
import {connect} from "react-redux";
import {TouchableOpacity} from "react-native";
import {CachedImage} from "react-native-img-cache";
import {translateText} from "../../translation/translate";
import {StoresList} from "../";
import {cinemaOrderList} from "../../../config/config";

class CinemaStores extends React.Component {
    static navigationOptions = ({navigation}) => {
        const {state} = navigation;
        if (state.params && state.params.type === 'REPLACE')
            return {
                title: translateText('Cinema').toUpperCase(),
                headerLeft: <TouchableOpacity onPress={() => navigation.navigate('DrawerOpen')}>
                    <CachedImage source={require("../../../assets/icons/menu-icon.png")}
                                 style={{width: 20, height: 20, margin: 15}}
                    />
                </TouchableOpacity>
            };
        return {
            title: translateText('Cinema').toUpperCase(),
        };
    };

    constructor(props) {
        super(props);
    }
 

    render() {
        return (
            <StoresList navigation={this.props.navigation}
                        cinema_stores={this.props.stores}
                        type={'cinema_stores'}/>
        )
    };
}

const mapStateToProps = ({main, auth}) => {
    const {payload} = main;
    const {user} = auth;
    const {cinema_stores} = payload.mall;
    if (payload !== null) {
        let st = payload.stores;
        let {cinemas} = payload;

        st = st.filter((store) => {
            if (user !== null && user.isLoggedIn) {
                let match = user["favorite_stores"].find(function (obj) {
                    return obj['s'] === store['_id'];
                });
                store['fav'] = !!match;
                store['userid'] = user['_id'];
            }
            
            store['cinemas'] = cinemas.filter((cinema_store) => {
                return cinema_store['store_id'] === store['_id']
            });

            return cinema_stores.filter((cinema_store) => {
                return cinema_store.s === store['_id']
            }).length > 0
        });

        const result = st.map(function (item) {
            let n = cinemaOrderList.indexOf(item["_id"]);
            return [n, item]
        }).sort().map(function (j) {
            return j[1]
        });
        

        return {stores: result}
    }
    return {stores: []};
};

const CinemaStoresRedux = connect(mapStateToProps)(CinemaStores);

export {CinemaStoresRedux as CinemaStores};