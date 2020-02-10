import {NEW_SP} from "./types";
import Api from "../api/Api";
import {Alert} from "react-native";
import {translateText} from "../translation/translate";

export const NewSP = (from, to, type, beacon = false) => {
    return (dispatch) => {
        let spData;
        if (beacon) {
            if (beacon.length === 0) {
                Alert.alert(translateText("error"), translateText("location_failed"));
                return;
            }
            spData = {
                start_location: from.id || "",
                end_location: to.id || "",
                beacons: [beacon[0]],
                type
            };
        }
        else {
            spData = {
                start_location: from.id,
                end_location: to.id,
                type
            };
        }

        Api.NewSP(spData).then((response) => {
            if (response.error) {
                Alert.alert("Error", response.error.msg);
            }
            else if (response.msg) {
                Alert.alert("Error", response.msg);
            }
            else {
                response.type = type;

                dispatch({
                    type: NEW_SP,
                    payload: response
                });
            }
        });
    };
};

export const resetSP = () => {
    return {
        type: NEW_SP,
        payload: false
    };
};
