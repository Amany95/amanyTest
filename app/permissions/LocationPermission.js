import {PermissionsAndroid} from "react-native";
import {checkPermission, requestPermission} from "./Permission";

const ACCESS_FILE_LOCATION = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;

const checkBluetoothPermission = () => {
	return checkPermission(ACCESS_FILE_LOCATION);
};

const requestBluetoothPermission = async () => {
	if (!checkBluetoothPermission()) {
		try {
			const granted = await requestPermission(ACCESS_FILE_LOCATION, "Cool Location App required Location permission", "We required Location permission in order to get device location Please grant us.");

			// // console.log('GRANTED', granted);
			return new Promise((resolve) => {
				if (granted === PermissionsAndroid.RESULTS.GRANTED) {
					resolve(true);
				}
				else {
					resolve(false);
				}
			});
		}
		catch (err) {
			alert(err);
		}
	}
};

export {requestBluetoothPermission, checkBluetoothPermission};

