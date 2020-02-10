import {Alert} from "react-native";
import {LOGIN_USER_SUCCESS} from "./types";
import Api from "../api/Api";
import AsyncStorage from "../utils/AsyncStorage";
import {translateText} from "../translation/translate";

export const favoriteAction = ({isFav, userid, item_id, item_type}) => {
    return (dispatch) => {
        if (userid !== null && userid !== undefined) {
            if (isFav) {
                // favorite remove
                Api.RemoveFavorite(userid, {item_id, item_type}).then((response) => {
                    if (!response.error) {
                        response.data.isLoggedIn = true;
                        AsyncStorage.setItem("userProfile", JSON.stringify(response.data));
                        dispatch({
                            type: LOGIN_USER_SUCCESS,
                            payload: response.data
                        });
                    }
                })
            }
            else {
                Api.AddFavorite(userid, {item_id, item_type}).then((response) => {
                    if (!response.error) {
                        response.data.isLoggedIn = true;
                        AsyncStorage.setItem("userProfile", JSON.stringify(response.data));
                        dispatch({
                            type: LOGIN_USER_SUCCESS,
                            payload: response.data
                        });
                    }
                })
            }
        }
        else {
            Alert.alert("Warning", translateText("message_sign_in_required_favorites"))
        }
    }
};
