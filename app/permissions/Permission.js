import {PermissionsAndroid} from "react-native";

export const checkPermission = (permission) => {
    const checkPermission = PermissionsAndroid.check(permission);
    return checkPermission === PermissionsAndroid.RESULTS.GRANTED;
};

export const requestPermission = async (permission, title = "Need Permission", message = "Need permission to access") => {
    return await PermissionsAndroid.request(permission,
        {
            "title": title,
            "message": message
        }
    );
};
