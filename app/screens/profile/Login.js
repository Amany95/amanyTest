import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React, {Component} from "react";
import {Input} from "../../components/common";
import {CachedImage} from "react-native-img-cache";
import {translateText} from "../../translation/translate";
import {BorderlessButton, DefaultButton} from "../../components/buttons";
import config from "../../../config/config";

export default class Login extends Component {

    render() {
        return (
            <View style={styles.container}>
                <View style={{flex: 0.7}}>
                    <View style={styles.cardContainer}>
                        <TouchableOpacity activeOpacity={0.8} style={styles.facebookButton}
                                          onPress={this.props.facebookLogin}>
                            <CachedImage source={require("../../../assets/icons/fb.png")}
                                         style={styles.facebookIcon}/>
                            <Text style={styles.buttonText}>{translateText("Login with Facebook")}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.cardContainer}>
                        <Text style={{
                            alignSelf: "center",
                            backgroundColor: "transparent",
                            color: "#555"
                        }}>{translateText("OR")}</Text>
                    </View>
                    <View style={styles.cardContainer}>
                        <Input placeholder={translateText("E-Mail")}
                               value={this.props.email}
                               style={styles.defaultInputStyle}
                               keyboardType={'email-address'}
                               onChangeText={email => this.props.onChange({email})}/>
                    </View>
                    <View style={styles.cardContainer}>
                        <Input secureTextEntry
                               placeholder={translateText("Password")}
                               value={this.props.password}
                               style={styles.defaultInputStyle}
                               onChangeText={password => this.props.onChange({password})}/>
                    </View>
                    <View style={styles.cardContainer}>
                        <BorderlessButton title={translateText("SIGN IN")} style={styles.defaultButtonStyle}
                                          onPress={this.props.emailLogin}/>

                    </View>
                    <View style={{alignItems: "center"}}>
                        <Text style={styles.linkText}
                              onPress={() => {
                                  this.props.navigation.navigate("ForgetPassword")
                              }}>
                            {translateText("ForgotPassword")}
                        </Text>

                    </View>
                    <View style={{marginTop: 20}}>
                        <DefaultButton titleStyle={{color: config().BASE_SECOND_COLOR}}
                                       title={translateText("Register").toUpperCase()} onPress={() => {
                            this.props.navigation.navigate("Register")
                        }} style={[styles.defaultButtonStyle, styles.borderButtonStyle]}/>
                    </View>
                </View>
            </View>

        )
    }

}

const styles = {
    defaultInputStyle: {
        backgroundColor: "#fff",
        borderColor: "#555",
        width: "100%",
        height: 40,
        borderWidth: 1,
        padding: 8,
        justifyContent: "center"
    },
    defaultButtonStyle: {
        width: "100%",
        height: 40,
        backgroundColor: config().BASE_SECOND_COLOR
    },
    borderButtonStyle: {
        backgroundColor: "transparent",
        borderColor: config().BASE_SECOND_COLOR,
        borderWidth: StyleSheet.hairlineWidth
    },
    backgroundImage: {
        backgroundColor: "#ccc",
        resizeMode: "cover",
        position: "absolute",
        width: "100%",
        height: "100%",
        justifyContent: "center"
    },
    facebookButton: {
        padding: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#003471"
    },

    loginButton: {
        padding: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#222"
    },
    buttonText: {
        color: "#fff",
        fontSize: 15
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row"
    },
    cardContainer: {
        marginBottom: 12
    },
    linkText: {
        fontSize: 15,
        margin: 15,
        color: config().BASE_SECOND_COLOR,
        backgroundColor: "transparent"
    },
    facebookIcon: {
        height: 20,
        resizeMode: "contain"
    }
};