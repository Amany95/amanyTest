import {LOAD_TRANSLATIONS, SET_LOCALE} from "../actions/types";
import I18n from "react-native-i18n";

export default (state = {}, action) => {
    switch (action.type) {
        case LOAD_TRANSLATIONS:
            I18n.fallbacks = true;
            I18n.translations = action.translations;
            return {
                ...state,
                translations: action.translations
            };
        case SET_LOCALE:
            I18n.locale = action.locale;
            return {
                ...state,
                locale: action.locale
            };
        default:
            return state;
    }
};