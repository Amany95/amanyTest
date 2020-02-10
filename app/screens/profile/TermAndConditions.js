import React from "react";
import {WebView} from "react-native";
import {translateText} from "../../translation/translate";
import config from "../../../config/config";


class TermAndConditions extends React.Component {
    static navigationOptions = () => ({
            title: translateText('Privacy').toUpperCase(),
            headerRight: null
        }
    );

    render() {
        return (
            <WebView
                source={{uri: config().BASE_URL + '/webview/malls/B1XYRGmMx/privacy-policy'}}
            />
        );
    }
}

export {TermAndConditions}