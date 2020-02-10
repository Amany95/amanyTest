import {translateText} from "../translation/translate";
import {Alert} from "react-native";
import { emergencyBtn } from "../actions/Beacon";


export const checkBeaconAndBluetooth = (test, props,setState) => {
    if (test) {
                            
        if (props.liveBeacon && props.liveBeacon.length > 0 && props.bluetooth) {
            this.minor = props.liveBeacon[0].minor;

            props.emergencyBtn({beacon_minor:this.minor});
        }
        else {
            props.ActionBluetoothPermission(true, props.mall.geofence_radius, (data) => {
                if (data.error) {

                    if (data.message) {
                        Alert.alert(translateText("error"), data.message);
                    }
                }
                else {
                setState;
                }
            });
        }
    }
    else {
        if (!props.bluetooth) {

            props.ActionBluetoothPermission(true, props.mall.geofence_radius, (data) => {
                if (data.error) {
                    if (data.message) {
                        Alert.alert(translateText("error"), data.message);
                    }
                }
                else {

                    setState;
                }
            });
        }
    }
}