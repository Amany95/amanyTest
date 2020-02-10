/* eslint-disable arrow-parens,camelcase */
import Api from "../api/Api";
import {beacon_udid} from "../../config/config";
import {Alert} from "react-native";
import {
    BEACON_LIVE,
    BEACON_PARKING,
    BEACON_VISITED,
    DEFAULT_NODES_DATA,
    BEACON_VISITED_SHOWED,
    DEFAULT_BEACON_DATA
} from "./types";
import AsyncStorage from "../utils/AsyncStorage";
import BeaconManager from "../utils/beacon/BeaconManager";

import {translateText} from "../translation/translate";


export const AllBeaconRequest = () => {
    return async (dispatch) => {
        try {
            const response = await Api.AllBeacon({
                uuid: beacon_udid
            });

            if (response.error) {
                Alert.alert("Error", response.msg);

                try {
                    this.allbeacons = JSON.parse(await AsyncStorage.getItem("allbeacons"));
                }
                catch (error) {
                    this.allbeacons = null;
                }

                dispatch({
                    type: DEFAULT_BEACON_DATA,
                    payload: this.allbeacons
                });
            }
            else {
                dispatch({
                    type: DEFAULT_BEACON_DATA,
                    payload: response
                });

                AsyncStorage.setItem("allbeacons", JSON.stringify(response));
            }
        }
        catch (err) {
            try {
                this.allbeacons = JSON.parse(await AsyncStorage.getItem("allbeacons"));
            }
            catch (error) {
                this.allbeacons = null;
            }

            // console.log("this.allbeacons", this.allbeacons);

            dispatch({
                type: DEFAULT_BEACON_DATA,
                payload: this.allbeacons
            });
        }
    };
};

export const AllNodesRequest = () => {
    return async (dispatch) => {
        try {
            const response = await Api.AllNodes({
                uuid: beacon_udid
            });

            if (response.error) {
                try {
                    this.allnodes = JSON.parse(await AsyncStorage.getItem("allnodes"));
                }
                catch (error) {
                    this.allnodes = null;
                }

                dispatch({
                    type: DEFAULT_NODES_DATA,
                    payload: this.allnodes
                });
            }
            else {
                dispatch({
                    type: DEFAULT_NODES_DATA,
                    payload: response
                });

                AsyncStorage.setItem("allnodes", JSON.stringify(response));
            }
        }
        catch (err) {

            try {
                this.allnodes = JSON.parse(await AsyncStorage.getItem("allnodes"));
            }
            catch (error) {
                this.allnodes = null;
            }

            // console.log("this.allnodes ", this.allnodes);

            dispatch({
                type: DEFAULT_NODES_DATA,
                payload: this.allnodes
            });
        }
    };
};

export const ActiveBeacons = (beacons) => {
    return (dispatch) => {

        BeaconManager.recievedBeacons([...beacons]);
        const stableBeacons = BeaconManager.getStableBeacons();

        dispatch({
            type: BEACON_LIVE,
            payload: stableBeacons
        });
    };
};

export const BeaconVisitedRequest = (beacons) => {
    return async (dispatch) => {
        dispatch({
            type: BEACON_VISITED,
            payload: {
                coordinate: beacons[0].coordinate,
                node: beacons[0].node,
                floor_no: beacons[0].floor_no
            }
        });

        if (beacons.length > 0) {
            const response = await Api.BeaconVisited({
                uuid: beacon_udid,
                beacons
            });

            if (response.error) {
                // Alert.alert("Error", response.error.msg);
            }
            else if (response.msg) {
                // Alert.alert("Error", response.msg);
            }
        }
    };
};

export const VisitedLocationShowed = () => {
    return (dispatch) => {
        dispatch({
            type: BEACON_VISITED_SHOWED
        });
    };
};

export const BeaconParkingSpot = (parkingSpot) => {
    return (dispatch) => {
        dispatch({
            type: BEACON_PARKING,
            payload: parkingSpot
        });
    };
};

export const BeaconParkingRequest = (callback) => {
    return async (dispatch) => {
        const beacons = BeaconManager.getStableBeacons();

        if (beacons && beacons.length > 0) {
            const response = await Api.BeaconParking({
                uuid: beacon_udid,
                beacons: beacons
            });

            if (callback && response.parking_spots) {
                callback(response.parking_spots);
            }

            if (response.error) {
                Alert.alert("Error", response.error.msg);
            }
            else if (response.msg) {
                Alert.alert("Error", response.msg);
            }
            else {
                dispatch({
                    type: BEACON_VISITED,
                    payload: {
                        node: response.node,
                        coordinate: response.coordinate
                    }
                });
            }
        }
    };
};


export const emergencyBtn = (data) => {
    return (dispatch) => {
        Api.emergencyBtn(data).then((response) => {
            emergencyBtnResponse(dispatch, response);
        }).catch(() => {
            Alert.alert("Warning", "Check your connection!");
        });
    };
};

function emergencyBtnResponse(dispatch, response) {

    // // console.log('LoginResponse', response);
    if (response.error && response.error.msg) {
        Alert.alert(translateText("error"), response.error.msg);
    }
    else {
        if (response.msg) {
            Alert.alert("Success", response.msg);
        }
    }
}
