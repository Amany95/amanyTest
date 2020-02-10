/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from "react";
import {Provider} from "react-redux";
import Router from "./app/Router";
import getStore from "./app/utils/store";

console.disableYellowBox = true;

class MyApp extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const store = getStore((onComplete) => {
            this.setState({onComplete});
        });

        return (
            <Provider store={store}>
                <Router/>
            </Provider>
        );
    }
}

export default MyApp;
