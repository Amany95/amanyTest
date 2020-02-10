import React from "react";
import {connect} from "react-redux";
import OptimizedFlatList from "../../components/common/OptimizedFlatList";
import {MagazineItem} from "../../components/magazine/MagazineItem";
import {TouchableOpacity} from "react-native";
import {CachedImage} from "react-native-img-cache";
import {translateText} from "../../translation/translate";

class Magazine extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: translateText("Magazine").toUpperCase(),
            headerLeft: <TouchableOpacity onPress={() => navigation.navigate("DrawerOpen")}>
                <CachedImage source={require("../../../assets/icons/menu-icon.png")}
                             style={{width: 20, height: 20, margin: 15}}
                />
            </TouchableOpacity>
        };
    };

    renderItem = ({item}) => {
        return (
            <MagazineItem magazine={item} onPress={() => {
                this.props.navigation.navigate("MagazineDetail", {magazine: item, title: item.title});
            }}/>
        )
    };

    render() {
        return (
            <OptimizedFlatList
                data={this.props.magazines}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
            />
        );
    }
}

const mapStateToProps = (state) => {
    const {payload} = state.main;
    if (payload !== null) {
        return {
            magazines: payload.magazines
        }
    }
    return {magazines: null};
};

const MagazineRedux = connect(mapStateToProps)(Magazine);

export {MagazineRedux as Magazine};