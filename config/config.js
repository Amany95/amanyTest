/* eslint-disable camelcase */
import {Platform} from "react-native";
import I18n from "react-native-i18n";
import {setCustomText, setCustomTextInput} from "react-native-global-props";
import RNMallFrameClient from "react-native-mall-frame-client";

//export const BASE_URL = "http://api.citystars.com.eg";
 export const BASE_URL = "http://10.180.183.78:9009";
 


export const BACKEND_BASE_RESOURCE_PATH = "/json/";

// export const server_client_id = "492848747142-c3hfnis7i85ea5nuu1ih9njeckj81ug2.apps.googleusercontent.com";
export const kns_website = "www.kns.com.tr";

export const mobileAppURL = Platform.select({
    ios: "https://itunes.apple.com/ae/app/citystars/id1061930881?mt=8",
    android: "https://play.google.com/store/apps/details?id=com.kns.citystars"
});

export const beacon_udid = "f7826da6-4fa2-4e98-8024-bc5b71e0893e";
export const beaconMajor = 12;

export const DEBUG_MODE = __DEV__;

export const cinemaOrderList = [
    // "SklAMXfnfx",
    // "H1r7kJjOZ",
    "rkXzWmGhMl",
    "Sy--ZXGhMg"
];

const config = () => {
    const currentLanguage = I18n.currentLocale().includes("ar") ? "ar" : "en";
    const API_URL = `${BASE_URL + BACKEND_BASE_RESOURCE_PATH}malls/B1XYRGmMx/`;

    return {

        /**
         *
         * Api URL And Default Info Data
         */
        BASE_URL: BASE_URL,
        API_URL: API_URL,
        INFO_DATA: {
            language: currentLanguage,
            device: Platform.OS,
            env: __DEV__ ? "development" : "production",
            push_token: this.push_token || "",
            userid: this.userid || ""
        },

        region: {
            identifier: "Citystars",
            uuid: beacon_udid,
            major: beaconMajor
        },

        setPushToken: (push_token) => {
            this.push_token = push_token;
            updateConfigureMallFrameClient();
        },
        getPushToken: () => {
            return this.push_token;
        },

        setUserID: (userid) => {
            this.userid = userid;
            updateConfigureMallFrameClient();
        },
        getUserid: () => {
            return this.userid;
        },

        setLanguage: (language) => {
            this.language = language;
            updateConfigureMallFrameClient();
        },

        getLanguage: () => {
            return this.language;
        },

        BASE_COLOR: "#11233a",
        BASE_SECOND_COLOR: "#d2ad57",

        /**
         *
         * Default Navbar Style
         */

        DEFAULT_NAVBAR_COLOR: "#11233a",
        DEFAULT_NAVBAR_TITLE_COLOR: "#fff",
        /**
         *
         * Default Status Bar Color for Android and Status Bar Style Both
         */

        DEFAULT_STATUS_BAR_COLOR: "#11233a",
        DEFAULT_STATUS_BAR_STYLE: "light-content",

        /**
         *
         * Default BackgroundColor For Main Screens
         */

        DEFAULT_BACKGROUND_COLOR: "#f3f3f3",

        /**
         *
         * Default Ripple Effect Color for View and Buttons in Android
         */

        DefaultRippleColor: "#d5d5d5",

        /**
         *
         * Default Button Color
         */

        DEFAULT_BUTTON_COLOR: "#11233a",
        DEFAULT_BUTTON_HIGHLIGHT_COLOR: "#d2ad57",

        /**
         *
         * Default http parameter suffix
         */
        DEFAULT_HTTP_SUFFIX: () => {
            return `?language=${currentLanguage}&device=${Platform.OS}`;
        },

        /**
         *
         *
         * beacon control active or passive
         */
        beaconMode: true
    };
};

const updateConfigureMallFrameClient = () => {

    // console.log(config().getPushToken());
    RNMallFrameClient.configure({
        url: config().API_URL || "",
        userid: config().getUserid() || "",
        push_token: config().getPushToken() || "",
        client_id: beacon_udid,
        kontakt_apikey: "ATTCbJIgCBjSuwJAoTQHizFYVDjhJIQA",
        identifier: "citystars",
        language: config().getLanguage() || ""
    });
};

setCustomText({
    style: {
        fontFamily: "RobotoCondensed-Regular",
        color: "#000"
    }
});

setCustomTextInput({
    style: {
        fontFamily: "RobotoCondensed-Regular",
        color: "#000"
    }
});

export default config;
