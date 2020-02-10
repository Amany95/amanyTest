import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {connect} from "react-redux";
import ListItem from '../../components/stores/ListItem'
import {favoriteAction} from "../../actions/Favorite";
import OptimizedFlatList from "../../components/common/OptimizedFlatList";
import {getDefaultLanguageText} from "../../translation/translate";

class StoresList extends React.Component {
    static navigationOptions = ({navigation}) => {
        const {state} = navigation;
        return {
            title: `${getDefaultLanguageText(state.params.title)}`.toUpperCase(),
        };
    };

    constructor(props) {
        super(props);
        this._renderItem = this._renderItem.bind(this);
    }


    _renderItem({item}) {
        if (this.props.type === 'cinema_stores') {
            return (
                <ListItem item={item}
                          onPress={() => {
                              this.props.navigation.navigate('Cinema', {cinemas: item.cinemas, title: item.name});
                          }}/>
            )
        }

        return (
            <ListItem item={item}
                      onPress={() => {
                          this.props.navigation.navigate('StoreDetail', {data: item, title: item.name});
                      }}/>
        );
    }

    render() {
        let stores = null;
        if (this.props.navigation.state && this.props.navigation.state.params)
            stores = this.props.navigation.state.params.stores;

        if (!stores && this.props['cinema_stores']) {
            stores = this.props['cinema_stores']
        } else if (!stores && this.props['hotel_stores']) {
            stores = this.props['hotel_stores']
        }

        if (stores !== null && stores.length !== 0) {
            this.renderedContent = <OptimizedFlatList
                renderItem={this._renderItem}
                data={stores}
                keyExtractor={(item, key) => key.toString()}
                style={styles.rootContainer}
            />
        } else {
            this.renderedContent = <ActivityIndicator size='small' color='#fff'/>
        }

        return (
            <View style={{height: '100%'}}>
                {this.renderedContent}
            </View>
        )
    };


}

const styles = {
    rootContainer: {
        height: '100%'
    }
};


const mapStateToProps = (state) => {
    return state;
};

const StoresListRedux = connect(mapStateToProps, {favoriteAction})(StoresList);

export {StoresListRedux as StoresList}
