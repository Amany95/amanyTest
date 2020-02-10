import React from "react";
import {StyleSheet, TouchableOpacity, View, WebView} from "react-native";
import {HeaderBackButton} from "react-navigation";
import {CachedImage} from "react-native-img-cache";
import config from "../../config/config";
import {Indicator} from "../components/common/Indicator";

class Browser extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: navigation.state.params.title.toUpperCase(),
            headerLeft: < HeaderBackButton
                tintColor={"#ffffff"}
                pressColorAndroid={"#ffffff"}
                onPress={() => {
                    if (navigation.state.params && navigation.state.params.browserClosed) {
                        navigation.state.params.browserClosed();
                    }
                    navigation.goBack();
                }}
            />
        }
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            navState: {
                title: ""
            },
            loading: false
        };
    }

    onNavigationStateChange = (navState) => {
        this.setState({navState});
    };

    onLoad = () => {
        this.setState({loading: false});
    };

    onLoadStart = () => {
        this.setState({loading: true});
    };

    render() {
        const {uri} = this.props.navigation.state.params;

        return (
            <View style={styles.container}>
                <WebView
                    ref={"webview"}
                    startInLoadingState
                    automaticallyAdjustContentInsets={false}
                    scalesPageToFit={false}
                    onNavigationStateChange={this.onNavigationStateChange}
                    source={{uri: uri}}
                    onLoadStart={this.onLoadStart}
                    onLoad={this.onLoad}
                />
                <View style={styles.toolbarStyle}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.buttonStyle} onPress={() => {
                            this.refs.webview.goBack();
                        }}>
                            <CachedImage source={require("../../assets/icons/back_brow.png")}
                                         style={styles.imageButton}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonStyle} onPress={() => {
                            this.refs.webview.goForward();
                        }}>
                            <CachedImage source={require("../../assets/icons/forward.png")}
                                         style={styles.imageButton}/>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.buttonStyle} onPress={() => {
                        this.refs.webview.reload();
                    }}>
                        {this.state.loading ? <Indicator color={"#fff"}/> :
                            <CachedImage source={require("../../assets/icons/ic_reload.png")}
                                         style={styles.imageButton}/>}
                    </TouchableOpacity>

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    toolbarStyle: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 56,
        backgroundColor: config().BASE_COLOR,
        padding: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    titleStyle: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#fff",
        width: "60%",
        textAlign: "center"
    },
    backTitleStyle: {
        fontSize: 15,
        color: "#00a29e"
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "center"
    },
    imageButton: {
        height: 24,
        width: 24
    },
    buttonStyle: {
        marginLeft: 10
    }
});

export {Browser};
