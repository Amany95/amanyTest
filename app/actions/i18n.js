import {LOAD_TRANSLATIONS, SET_LOCALE} from "./types";
import AsyncStorage from "../utils/AsyncStorage";
import Api from "../api/Api";

export const loadTranslations = (translations) => {
    return {
        type: LOAD_TRANSLATIONS,
        translations
    };
};

export const setLocale = (locale, saveToStorage = false) => async (dispatch) => {
    locale = locale.includes("ar") ? "ar" : "en";

    AsyncStorage.setItem("language", locale);

    dispatch({
        type: SET_LOCALE,
        locale
    });

    setTimeout(async () => {
        await Api.setLanguage();
    }, 2000)
};
