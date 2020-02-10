/* eslint-disable react/no-deprecated */
import React from "react";
import {connect} from "react-redux";
import {Alert, FlatList} from "react-native";
import PropTypes from "prop-types";
import _ from "lodash";

import CategoryListItem from "../../components/stores/CategoryListItem";

class FloorListScreen extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            filteredLevel: this.props.floors
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.searchTerm !== this.props.searchTerm) {
            this.filterFloors(nextProps.searchTerm);
        }
    }

    filterFloors = (searchTerm: string) => {
        this.setState({
            filteredLevel: searchTerm !== "" ? _.cloneDeep(this.props.floors).filter((level) => {
                return level.name["en"].toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
            }) : this.props.floors
        })
    };
    
    onPressedCard = (item) => {
        if (item.stores.length !== 0) {
            //return Actions.push('stores_list', {data: item, title: getDefaultLanguageText(item.name)});

            return this.props.navigation.navigate("StoresList", {
                stores: item.stores,
                title: item.name
            });
        }
        Alert.alert("Stores", "Stores aren't found in the floor");
    };

    _renderItem({item}) {
        return (
            <CategoryListItem item={item} onPress={() => {
                return this.onPressedCard(item)
            }}/>
        )
    }

    render() {
        return (
            <FlatList data={this.state.filteredLevel}
                      keyExtractor={(item) => {
                          return item["_id"]
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
        paddingRight: 15
    }
};

const mapStateToProps = (state) => {
    const {payload} = state.main;
    if (payload !== null) {
        let floors = payload.floors;
        let st = payload.stores;

        floors.forEach((c) => {
            c.stores = [...st.filter((store) => {
                return store.locations.filter((floor) => {
                    return c.locations.includes(floor["s"])
                }).length > 0
            })];
        });
        return {floors: floors.reverse()}
    }
    return {floors: []};
};

FloorListScreen.defaultProps = {
    navigation: {},
    floors: [],
    searchTerm: ""
};

FloorListScreen.propTypes = {
    navigation: PropTypes.instanceOf(Object),
    floors: PropTypes.instanceOf(Array),
    searchTerm: PropTypes.string
};

export default connect(mapStateToProps)(FloorListScreen);
