import React from 'react';
import {connect} from "react-redux";
import OptimizedFlatList from "../../components/common/OptimizedFlatList";
import {CinemaItem} from "../../components/cinema/CinemaItem";
import {getDefaultLanguageText} from "../../translation/translate";


class Cinema extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: getDefaultLanguageText(navigation.state.params.title).toUpperCase(),
        };
    };

    renderItem = (cinema) => {

        return (
            <CinemaItem cinema={cinema} onPress={() => {
                this.props.navigation.navigate('CinemaDetail', {data: cinema, title: cinema.item.title});
            }}/>
        )
    };

    render() {
        const {cinemas} = this.props.navigation.state.params;
        return (
            <OptimizedFlatList
                data={cinemas}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
            />
        );
    }
}

const mapStateToProps = (state) => {
    return state
};

const CinemaRedux = connect(mapStateToProps)(Cinema);

export {CinemaRedux as Cinema};