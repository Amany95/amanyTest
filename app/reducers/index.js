import {combineReducers} from "redux";
import MainReducer from "./MainReducer";
import AuthReducer from "./AuthReducer";
import FavoriteReducer from "./FavoriteReducer";
import configReducer from "./ConfigReducer";
import FloorReducer from "./FloorReducer";
import {NavReducer} from "./NavReducer";
import StoreReducer from "./StoreReducer";
import NotificationReducer from "./NotificationReducer";
import GeolocationReducer from "./GeolocationReducer";
import BeaconReducer from "./BeaconReducer";
import BluetoothReducer from "./BluetoothReducer";

export default combineReducers({
    nav: NavReducer,
    i18n: configReducer,
    main: MainReducer,
    auth: AuthReducer,
    fav: FavoriteReducer,
    floor: FloorReducer,
    stores: StoreReducer,
    notification: NotificationReducer,
    geolocation: GeolocationReducer,
    beacon: BeaconReducer,
    bluetooth: BluetoothReducer
});
