import {getDefaultLanguageText} from "../../translation/translate";
import {Card} from "../common";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import {CachedImage} from "react-native-img-cache";

export default ParentCategoryItem = ({item, onPress}) => {
    return (
        <Card style={styles.cardContainer}>
            <TouchableOpacity onPress={onPress} style={styles.container}>
                <View style={[styles.buttonStyle, {
                    flexDirection: getDefaultLanguageText({
                        en: "row",
                        ar: "row-reverse"
                    })
                }]}>
                    <Text style={styles.textStyle}>{getDefaultLanguageText(item["name"])}</Text>
                    <View style={{
                        flexDirection: getDefaultLanguageText({
                            en: "row",
                            ar: "row-reverse"
                        })
                    }}>
                        <Text style={[styles.textStyle, {
                            fontFamily: getDefaultLanguageText({
                                ar: "GEDinarOne-Medium",
                                en: "RobotoCondensed-Regular"
                            })
                        }]}>({getDefaultLanguageText(item["stores"].length)})</Text>
                        {getDefaultLanguageText({
                            en: <CachedImage style={styles.iconStyle}
                                             source={require("../../../assets/icons/ic_right_arrow.png")}/>,
                            ar: <CachedImage style={styles.iconStyle}
                                             source={require("../../../assets/icons/ic_left_arrow.png")}/>
                        })}
                    </View>
                </View>
            </TouchableOpacity>
        </Card>
    )
}

const styles = {
    cardContainer: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: "#ccc",
        paddingTop: 10,
        paddingBottom: 10
    },
    iconStyle: {
        resizeMode: "contain",
        width: 10,
        height: 10,
        alignSelf: "center",
        marginStart: 15
    },
    container: {
        padding: 10
    },
    buttonStyle: {
        justifyContent: "space-between",
        alignItems: "center"
    },
    textStyle: {
        fontSize: 16
    }
};
