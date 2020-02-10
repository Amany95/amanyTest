import React from "react";
import {ActivityIndicator, Modal, View} from "react-native";

const Loader = (props) => {
    const {
        loading,
        onRequestClose
    } = props;
    return (
        <Modal visible={loading} animationType="fade" transparent={true} onRequestClose={onRequestClose}>
            <View style={styles.container}>
                <View style={styles.indicatorContainer}>
                    <ActivityIndicator size='large' color='#00BFFF'/>
                </View>
            </View>
        </Modal>
    )
};

const styles = {
    container: {
        position: "absolute",
        alignItems: "center",
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        justifyContent: "center",
        shadowOpacity: 0.2,
        elevation: 1,
        alignSelf: "center"
    },
    indicatorContainer: {
        padding: 15,
        backgroundColor: "#fff",
        borderRadius: 5
    }
};

export default Loader;
