import React from "react";
import {WebView} from "react-native";
import {getDefaultLanguageText} from "../../translation/translate";
import {connect} from "react-redux";

class MagazineDetail extends React.Component {
    static navigationOptions = ({navigation}) => {
        const {state} = navigation;
        return {
            title: `${getDefaultLanguageText(state.params.title)}`.toUpperCase()
        };
    };

    render() {
        const {magazine} = this.props.navigation.state.params;

        return (
            <WebView
                style={styles.container}
                source={{uri: magazine.webview}}>
            </WebView>
        );
    }
}

const styles = {
    container: {
        flex: 1
    }
};

const mapStateToProps = (state) => {
    return state
};

const MagazineDetailRedux = connect(mapStateToProps)(MagazineDetail);

export {MagazineDetailRedux as MagazineDetail};
