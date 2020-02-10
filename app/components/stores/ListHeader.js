import React from "react";
import {Text, View} from "react-native";
import config from "../../../config/config";

const ListHeader = ({section}) => {
    return (
        <View style={styles.rootContainer}>
            <View style={styles.container}>
                <Text style={styles.storeLetter}>{section.title}</Text>
            </View>
        </View>
    );
};

const styles = {
    storeLetter: {
        color: config().BASE_SECOND_COLOR,
        fontWeight: "600",
        fontSize: 16,
        height: 25
    },
    rootContainer: {
        padding: 5,
        paddingTop: 2,
        backgroundColor: "#fff",
        borderColor: "#ccc",
        borderBottomWidth: 1
    }
};

export default ListHeader;
