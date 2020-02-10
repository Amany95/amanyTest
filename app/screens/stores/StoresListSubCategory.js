import React from 'react';
import {View} from 'react-native';
import {connect} from "react-redux";
import {favoriteAction} from "../../actions/Favorite";
import OptimizedFlatList from "../../components/common/OptimizedFlatList";
import CategoryListItem from "../../components/stores/CategoryListItem";

class StoreListSubCategory extends React.Component {
    static navigationOptions = ({navigation}) => {
        const {state} = navigation;
        return {
            title: `${state.params.title}`.toUpperCase(),
        };
    };

    constructor(props) {
        super(props);
        this._renderItem = this._renderItem.bind(this);
    }

    _renderItem = ({item}) => {
        return (
            <CategoryListItem item={item} onPress={() => {
                this.props.navigation.navigate('StoresList', {
                    stores: this.props.stores.filter((store) => store.categories.filter(category => category['s'] == item['_id']).length > 0),
                    title: item.name
                })
            }}/>
        );
    }

    render() {
        const {data} = this.props.navigation.state.params;

        return (
            <View style={{
                height: '100%'
            }}>
                <OptimizedFlatList
                    renderItem={this._renderItem}
                    data={data.subcategories}
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


const mapStateToProps = ({main}) => {
    return {stores: main.payload.stores};
};

const StoreListSubCategoryRedux = connect(mapStateToProps, {favoriteAction})(StoreListSubCategory);

export {StoreListSubCategoryRedux as StoreListSubCategory}
