/* eslint-disable camelcase,no-template-curly-in-string,arrow-parens,no-extra-parens */
// eslint-disable-next-line no-await-in-loop
import {BLUETOOTH_STATUS} from "./types";
import {translateText} from "../translation/translate";
import {requestBluetoothPermission} from "../permissions";
import {Alert, Platform} from "react-native";
import BluetoothManager from "react-native-bluetooth-listener";
import AsyncStorage from "../utils/AsyncStorage";
import RNMallFrameClient, {Beacon, Geofence} from "react-native-mall-frame-client";

export const StatusChanged = (enabled) => {
    return ((dispatch) => {
        dispatch({
            type: BLUETOOTH_STATUS,
            payload: enabled
        });
    });
};

export const ActionBluetoothPermission = (must_ask_again: boolean = false, geofence_radius = 400, callback) => {
    let status = {
        error: true,
        msg: ""
    };

    return (async () => {
        let bluetoothPermissionDialog = "ask_again";

        try {
            bluetoothPermissionDialog = await AsyncStorage.getItem("bluetooth_permission") || "ask_again";
        }
        catch (err) {
            bluetoothPermissionDialog = "ask_again";
        }

        if ((must_ask_again && bluetoothPermissionDialog !== "OK") || bluetoothPermissionDialog === "ask_again") {

            Alert.alert(
                translateText("bluetooth_dialog_title"),
                translateText("bluetooth_permission_explanation"),
                [
                    {
                        text: "Ask me later", onPress: () => {
                            AsyncStorage.setItem("bluetooth_permission", "ask_again");
                            if (callback) {
                                callback(status);
                            }
                        }
                    },
                    {
                        text: "Cancel", onPress: () => {
                            AsyncStorage.setItem("bluetooth_permission", "cancel");
                            if (callback) {
                                callback(status);
                            }
                        }, style: "cancel"
                    },
                    {
                        text: "OK", onPress: async () => {
                            AsyncStorage.setItem("bluetooth_permission", "OK");
                            let isGranted = await permissionIsGranted(geofence_radius);

                            if (isGranted) {
                                await BluetoothManager.enable(true);
                                await RNMallFrameClient.gpsEnable();
                                const resp = await BluetoothManager.getCurrentState();

                                let {connectionState} = resp.type;

                                if (Platform.OS === "ios") {
                                    callbackMessage(callback, connectionState);
                                }

                                setTimeout(() => {
                                    status.error = false;
                                    if (callback) {
                                        callback(status);
                                    }
                                }, 500);
                            }
                            else {
                                if (callback && must_ask_again) {
                                    status.message = translateText("activate_to_location");
                                    callback(status);
                                }
                            }
                        }
                    }],
                {cancelable: true}
            );
        }

        else if (bluetoothPermissionDialog === "OK") {

            let isGranted = await permissionIsGranted(geofence_radius);
            if (isGranted) {
                await BluetoothManager.enable(true);
                const resp = await BluetoothManager.getCurrentState();
                let {connectionState} = resp.type;
                if (Platform.OS === "ios") {
                    callbackMessage(callback, connectionState);
                }

                setTimeout(() => {
                    status.error = false;
                    if (callback) {
                        callback(status);
                    }
                }, 500);

            }
            else {
                if (callback && must_ask_again) {
                    status.message = translateText("activate_to_location");
                    callback(status);
                }
            }
        }
        else {
            // console.log("else");

            if (must_ask_again && callback) {
                callback(status);
            }
        }
    });
};

export const permissionIsGranted = async (geofence_radius) => {
    let isGranted;

    await RNMallFrameClient.gpsEnable();

    try {
        if (Platform.OS === "ios") {
            isGranted = true;
        }
        else {
            isGranted = await requestBluetoothPermission();
        }
    }
    catch (e) {
        // console.log("e", e);
    }

    if (isGranted && geofence_radius) {
        Geofence.start({
            locations: [{
                lat: 30.0732591,
                lang: 31.3449723,
                key: "citystars",
                radius: parseFloat(geofence_radius)
            }]
        });

        Beacon.start();
    }

    return isGranted;
};

const callbackMessage = (callback, connectionState) => {
    let status = {
        error: true,
        msg: ""
    };

    if (callback) {
        if (connectionState === "on") {
            callback({
                error: false,
                message: "success"
            });
        }
        else {
            status.message = translateText("activate_to_bluetooth");
            callback(status);
        }
    }
};
