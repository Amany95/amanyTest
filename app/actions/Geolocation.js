import Api from "../api/Api";
import {Alert} from "react-native";
import {NEW_GEOFENCE} from "./types";

/**
 * Geofence request moved to native side for both device types
 *
 * @param key
 * @returns {Function}
 * @constructor
 */

export const NewGeofence = (key) => {
	return async (dispatch) => {
		const response = await Api.NewGeofence({
			identifier: `geofence_${key}`
		});
		// // console.log(response);

		if (response.error) {
			Alert.alert("Error", response.error.msg);
		}
		else if (response.msg) {
			Alert.alert("Error", response.msg);
		}
		else {
			dispatch({
				type: NEW_GEOFENCE,
				payload: response
			});
		}
	};
};
