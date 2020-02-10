/**
 * Custom WebView with autoHeight feature
 *
 * @prop source: Same as WebView
 * @prop autoHeight: true|false
 * @prop defaultHeight: 100
 * @prop width: device Width
 * @prop ...props
 *
 * @author Elton Jain
 * @version v1.0.2
 */

import React, {Component} from "react";
import {Dimensions, WebView, Platform} from "react-native";
import config from "../../../config/config";

export default class AutoHeightWebView extends Component {

    state = {
        height: 1,
        width: Dimensions.get("window").width
    };

    constructor(props) {

        super(props);
        this._onMessage = this._onMessage.bind(this);
    }

    _onMessage(e) {

        console.log("_onMessage called");

        let data = e.nativeEvent.data;

        try {
            data = JSON.parse(data);
        }
        catch (error) {
            console.log("e", error);
        }

        if (typeof data === "object" && data.name === "external_url_open") {

            this.props.navigation.navigate("Browser", {
                uri: data.data.url,
                title: data.data.title.trim()
            });
        }

        if (typeof data === "object" && data.name === "heightEvent") {

            this.setState((prevState) => ({
                ...prevState,
                size: {
                    width: prevState.width,
                    height: data.data
                }
            }));
        }
    }

    getInjectedJavascript = () => {

        // add viewport setting to meta for WKWebView
        const makeScalePageToFit = `
            var meta = document.createElement('meta'); 
            meta.setAttribute('name', 'viewport'); 
            meta.setAttribute('content', 'width=device-width'); document.getElementsByTagName('head')[0].appendChild(meta);
        `;

        const externalLink = "!function(){var e=function(e,n,t){if(n=n.replace(/^on/g,\"\"),\"addEventListener\"in window)e.addEventListener(n,t,!1);else if(\"attachEvent\"in window)e.attachEvent(\"on\"+n,t);else{var o=e[\"on\"+n];e[\"on\"+n]=o?function(e){o(e),t(e)}:t}return e},n=document.querySelectorAll(\"a[href]\");if(n)for(var t in n)n.hasOwnProperty(t)&&e(n[t],\"onclick\",function(e){new RegExp(\"^https?://\"+location.host,\"gi\").test(this.href)||(e.preventDefault(),window.postMessage(JSON.stringify({name: 'external_url_open', data: {url:this.href, title: this.innerHTML}})))})}();";

        return `
            window.addEventListener("load", updateSize);
            ${Platform.OS === "ios" ? makeScalePageToFit : ""}
            ${externalLink}
            updateSize();
            
            function updateSize() {
                
                if (!window.hasOwnProperty('postMessage')) {
                    console.log("waiting to be connected");
                    setTimeout(updateSize, 200);
                    return;
                }
                
                var body = document.body;
                var html = document.documentElement;
                
                var height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
                
                setTimeout(function () {
                    window.postMessage(JSON.stringify({name: "heightEvent", data: height,  event: event}));
                }, 500);                
            }
        `;
    };

    render() {

        return (
            <WebView
                originWhitelist={["*"]}
                javaScriptEnabled={true}
                onMessage={this._onMessage}
                scrollEnabled={false}
                ref={(ref) => {
                    this.webview = ref;
                }}
                injectedJavaScript={this.getInjectedJavascript()}
                style={this.state.size}
                source={{uri: this.props.defaultUrl + config().DEFAULT_HTTP_SUFFIX()}}
            />
        )
    }
}
