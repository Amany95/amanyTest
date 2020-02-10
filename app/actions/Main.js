/* eslint-disable arrow-parens,no-template-curly-in-string,no-await-in-loop */
import {
    CHECK_SERVER,
    CONNECTION_STATUS,
    LOAD_SERVER_FAIL,
    LOAD_SERVER_SUCCESS,
    LOGIN_USER_SUCCESS
} from "./types";
import AsyncStorage from "../utils/AsyncStorage";
import {loadTranslations, setLocale} from "./i18n";
import Languages from "../translation/languages/";
import I18n from "react-native-i18n";
import RNFetchBlob from "react-native-fetch-blob";
import Share from "react-native-share";
import Api from "../api/Api";
import config from "../../config/config";
import {AllBeaconRequest, AllNodesRequest, BeaconParkingSpot} from "./Beacon";

export const checkServer = () => {
        return async (dispatch) => {
            return new Promise(async function (resolve) {
                    dispatch({type: CHECK_SERVER});
                    try {
                        const versionData = await AsyncStorage.getItem("version");
                        this.previousVersion = versionData ? JSON.parse(versionData) : null;
                    }

                    catch (error) {
                        this.previousVersion = {};
                    }
                    try {
                        const contentData = await AsyncStorage.getItem("content");
                        this.previousContent = contentData ? JSON.parse(contentData) : null;
                    }
                    catch (error) {
                        this.previousContent = [];
                    }
                    try {
                        const userProfileData = await AsyncStorage.getItem("userProfile");
                        this.userProfile = userProfileData ? JSON.parse(userProfileData) : null;
                    }
                    catch (error) {
                        this.userProfile = {};
                    }
                    try {
                        this.language = await AsyncStorage.getItem("language") || "en";
                    }
                    catch (error) {
                        this.language = "en";
                    }
                    try {
                        this.pushToken = JSON.parse(await AsyncStorage.getItem("push_token"));
                    }
                    catch (error) {
                        this.pushToken = "";
                    }

                    try {
                        this.parking_spot = JSON.parse(await AsyncStorage.getItem("parking_spot"));
                    }
                    catch (error) {
                        this.parking_spot = "";
                    }

                    if (this.parking_spot === "") {
                        try {
                            this.parking_spot = JSON.parse(await AsyncStorage.getItem("qr_code"));
                        }
                        catch (error) {
                            this.parking_spot = "";
                        }
                    }

                    dispatch(AllBeaconRequest());

                    // get ALL NODES if we have internet connection or load before result
                    dispatch(AllNodesRequest());

                    // load parking spot data
                    dispatch(BeaconParkingSpot(this.parking_spot));
                    // load language
                    dispatch(setLocale(this.language !== null ? this.language : I18n.currentLocale()));
                    //load translations
                    dispatch(loadTranslations(Languages));
                    // load user
                    dispatch({
                        type: LOGIN_USER_SUCCESS,
                        payload: this.userProfile
                    });
                    //set default Token
                    config().setPushToken(this.pushToken);

                    if (this.userProfile) {
                        config().setUserID(this.userProfile["_id"]);
                    }

                    const all = await Api.getAll({});
                    // console.log("all", all);

                    if (all && Object.keys(all.content).length !== 0) {
                        this.newContent = all.content;

                        if (this.previousContent && this.previousContent["mall"] === {} && this.newContent["mall"] === {}) {
                            AsyncStorage.setItem("version", "");
                            dispatch(loadError({key: "Error", content: "Unexpected error please reload app."}));
                            return;
                        }

                        await AsyncStorage.setItem("version", JSON.stringify(all.version));
                        await AsyncStorage.setItem("content", JSON.stringify(this.newContent));

                        dispatch({type: LOAD_SERVER_SUCCESS, payload: this.newContent});
                    }
                    else {
                        dispatch(loadError({key: "Warning", content: "Check your connection"}));

                        if (Object.keys(this.previousContent).length !== 0) {
                            dispatch({type: LOAD_SERVER_SUCCESS, payload: this.previousContent});
                        }
                        else {
                            dispatch(loadError({key: "Error", content: "Need Internet Connection to First Load."}));
                        }
                    }

                    resolve(true);
                }
            );
        };
    }
;

function loadError(error) {
    return {type: LOAD_SERVER_FAIL, error};
}

export const shareData = (shareOptions) => {
    return () => {
        RNFetchBlob.config({
            fileCache: true
        }).fetch("GET", shareOptions.url)
            .then((res) => {
                return res.readFile("base64");
            }).then((str) => {
            shareOptions.url = "data:image/png;base64," + str;
            Share.open(shareOptions);
        });
    };
};

export const setIsConnected = (connection) => {
    return (dispatch) => {
        dispatch({
            type: CONNECTION_STATUS,
            payload: connection
        });
    };
};
