import React from "react";
import {ScrollView, Text, View} from "react-native";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {CachedImage} from "react-native-img-cache";

import {getDefaultLanguageText, translateText} from "../../translation/translate";
import {Button} from "../../components/common";
import AutoHeightWebView from "../../components/common/AutoHeightWebView";
import Normalize from "../../utils/Normalize";
import config from "../../../config/config";
import {DURATION} from "react-native-easy-toast";
import ModalSelector from "../../components/common/modal/ModalSelector";

class ServiceDetail extends React.Component {
    static navigationOptions = ({navigation}) => {
        const {state} = navigation;

        return {
            title: `${getDefaultLanguageText(state.params.title)}`.toUpperCase()
        };
    };

    selectLocationMallMap = (data) => {
        if (data.locations.length <= 1) {
            return (
                <Button style={styles.buttonStyle}
                        onPress={() => {
                            if (data.locations.length === 0) {
                                if (this.toast) {
                                    this.toast.show("Location not found.", DURATION.LENGTH_LONG);
                                }
                            }
                            else {
                                this.props.navigation.navigate("MallMap", {
                                    locationOpen: data.locations[0].s,
                                    locationType: "service"
                                });
                            }
                        }}>
                    <Text style={styles.button}>{translateText("show_on_map")}</Text>
                </Button>
            );
        }

        const locations = data.locations.map((location) => {
            let floor = location.s.split("_");
            let extra = floor[0].length === 3 ? "-" : "";

            return {
                key: location.s,
                label: `${translateText("Floor")} ${extra}${floor[0][floor[0].length - 1]}`
            };
        });

        return (
            <ModalSelector
                data={locations}
                style={{flex: 1}}
                cancelText={translateText("Cancel")}
                buttonStyle={styles.buttonStyle}
                onChange={(option) => {
                    this.props.navigation.navigate("MallMap", {
                        locationOpen: option.key,
                        locationType: "service"
                    });
                }}>
                <Text style={styles.button}>{translateText("show_on_map")}</Text>
            </ModalSelector>
        );
    };

    selectLocationWayfinder = (data) => {
        if (data.locations.length <= 1) {
            return (
                <Button style={styles.buttonStyle} onPress={() => {

                    if (data.locations.length === 0) {
                        if (this.toast) {
                            this.toast.show("Location not found.", DURATION.LENGTH_SHORT);
                        }
                    }
                    else {
                        this.props.navigation.navigate("Wayfinder", {
                            to: {
                                id: data.locations[0].s,
                                type: "store",
                                title: data.name,
                                image_url: data.logo,
                                rawData: data
                            }
                        });
                    }
                }}>
                    <Text style={styles.button}>{translateText("Wayfinder").toUpperCase()}</Text>
                </Button>
            );
        }

        const locations = data.locations.map((location) => {
            let floor = location.s.split("_");
            let extra = floor[0].length === 3 ? "-" : "";

            return {
                key: location.s,
                label: `${translateText("Floor")} ${extra}${floor[0][floor[0].length - 1]}`
            };
        });

        return (
            <ModalSelector
                data={locations}
                style={{flex: 1}}
                cancelText={translateText("Cancel")}
                buttonStyle={styles.buttonStyle}
                onChange={(option) => {
                    this.props.navigation.navigate("Wayfinder", {
                        to: {
                            id: option.key,
                            type: "store",
                            title: data.name,
                            image_url: data.logo,
                            rawData: data
                        }
                    });
                }}>
                <Text style={styles.button}>{translateText("Wayfinder").toUpperCase()}</Text>
            </ModalSelector>
        );
    };

    render() {
        const {data} = this.props.navigation.state.params;

        return (
            <View style={styles.container}>
                <ScrollView style={styles.container}>
                    <View style={{
                        width: "100%",
                        height: Normalize(200),
                        alignSelf: "center"
                    }}>
                        <CachedImage source={{uri: data.image}} style={styles.image}/>
                    </View>
                    <View style={styles.cardContainer}>
                        <View style={{
                            borderTopWidth: 1,
                            paddingTop: 15,
                            alignItems: "center"
                        }}>
                            <Text style={styles.title}>{getDefaultLanguageText(data.name)}</Text>
                        </View>

                        <AutoHeightWebView
                            navigation={this.props.navigation}
                            defaultUrl={data.explanation}
                            autoHeight={true}
                        />
                    </View>

                </ScrollView>
                {data.locations.length !== 0 ? <View style={styles.buttonGroup}>
                    {this.selectLocationMallMap(data)}
                    {this.selectLocationWayfinder(data)}
                </View> : null}
            </View>

        );
    }
}

const styles = {
    likeButtonContainer: {
        position: "absolute",
        right: 0,
        zIndex: 1,
        margin: 15
    },
    image: {
        resizeMode: "contain",
        width: "100%",
        height: "100%"
    },
    button: {
        color: config().DEFAULT_BUTTON_HIGHLIGHT_COLOR,
        fontSize: 15,
        alignSelf: "center",
        fontWeight: "300"
    },
    buttonStyle: {
        borderWidth: 1,
        flex: 1,
        padding: 10
    },
    buttonGroup: {
        flexDirection: "row",
        position: "absolute",
        bottom: 0,
        width: "100%"
    },
    title: {
        fontSize: 21,
        fontWeight: "300"
    },
    p: {
        fontSize: 17,
        margin: 16,
        marginBottom: 0,
        fontWeight: "300",
        alignSelf: "center"
    },
    cardContainer: {
        height: "100%",
        backgroundColor: "#fff"
    },
    container: {
        height: "100%",
        backgroundColor: "#fff"
    }
};

ServiceDetail.propTypes = {
    navigation: PropTypes.instanceOf(Object)
};

const ServiceDetailRedux = connect()(ServiceDetail);

export {ServiceDetailRedux as ServiceDetail};

