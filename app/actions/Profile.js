import {LOADING_REGISTER, LOGIN_USER_SUCCESS, REGISTER_COMPLETED, USER_LOGOUT} from "./types";
import {Alert} from "react-native";
import FacebookSDK from "../api/FacebookSDK";
import Api from "../api/Api";
import {NavigationActions} from "react-navigation";
import AsyncStorage from "../utils/AsyncStorage";
import config from "../../config/config";
import {translateText} from "../translation/translate";

export const saveProfilePhoto = (userid, data) => {
    return (dispatch) => {
        Api.saveImage(userid, data).then((response) => {
            LoginResponse(dispatch, response);
        });
    };
};

export const registerUser = (data) => {
    return (dispatch) => {
        dispatch({
            type: LOADING_REGISTER
        });

        Api.RegisterUser(data).then((response) => {
            // // console.log(response);
            dispatch({
                type: REGISTER_COMPLETED
            });

            if (response.error && response.error.msg) {
                Alert.alert(translateText("error"), response.error.msg);
            }
            else {

                if (response.data.login_type === "facebook") {
                    // login with facebook auto login

                    response.data.isLoggedIn = true;

                    LoginResponse(dispatch, response);
                    dispatch(NavigationActions.back());
                }
                else {
                    // login with email redirect login

                    response.data.isLoggedIn = false;
                    if (response.msg) {
                        Alert.alert(translateText("success"), response.msg);
                    }

                    dispatch(NavigationActions.back());
                }
                AsyncStorage.setItem("userProfile", JSON.stringify(response.data));

            }
        }).catch(() => {
            Alert.alert("Warning", "Check your connection!");
        });
    };
};

export const facebookLogin = () => {
    return (dispatch) => {
        FacebookSDK.login((response) => {
            FacebookSDK.api("/me", {fields: "id,email,first_name,last_name,gender,cover,link"}, (infoResponse) => {
                // // console.log(response, infoResponse);
                // console.log("response", response);
                // console.log("infoResponse", infoResponse);

                if (!response.error) {
                    Api.LoginWithFacebook(response, infoResponse).then((res) => {
                        // console.log(res);

                        if (res.action === "register") {
                            infoResponse["social_token"] = response.authResponse.accessToken;
                            dispatch(NavigationActions.navigate({
                                routeName: "Register", params: {user: infoResponse}
                            }));
                        }
                        else if (res.action === "login") {
                            LoginResponse(dispatch, res);
                        }
                    });
                }
            });
        }, "email,public_profile");
    };
};

export const loginUser = (data) => {
    return (dispatch) => {
        Api.LoginUser(data).then((response) => {
            LoginResponse(dispatch, response);
        }).catch(() => {
            Alert.alert("Warning", "Check your connection!");
        });
    };
};

export const forgetPassword = (data) => {
    return () => {
        Api.ForgetPassword(data).then((response) => {
            if (response.error && response.error.msg) {
                Alert.alert(translateText("error"), response.error.msg);
            }
            else {
                if (response.msg) {
                    Alert.alert("Success", response.msg.toString());
                }
            }
        }).catch(() => {
            Alert.alert("Warning", "Check your connection!");
        });
    };
};

export const logoutUser = (userid) => {
    return async (dispatch) => {
        dispatch({
            type: USER_LOGOUT
        });

        await AsyncStorage.removeItem("userProfile");

        await Api.LogoutUser(userid);
        config().setUserID("");
    }
};

export const updateUser = (data, user) => {
    return (dispatch) => {
        Api.UpdateUser(data, user).then((response) => {
            if (response.error && response.error.msg) {
                Alert.alert(translateText("error"), response.error.msg);
            }
            else {
                response.data.isLoggedIn = true;
                AsyncStorage.setItem("userProfile", JSON.stringify(response.data));

                //update user id => config
                config().setUserID(response.data["_id"]);

                updateUserSuccess(dispatch, response.data);
                Alert.alert("Success", "Successfully updated.");
            }
        }).catch(() => {
            Alert.alert("Warning", "Check your connection!");
        });
    };
};

const updateUserSuccess = (dispatch, user) => {
    dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: user
    });
};

function LoginResponse(dispatch, response) {

    // // console.log('LoginResponse', response);
    if (response.error && response.error.msg) {
        Alert.alert(translateText("error"), response.error.msg);
    }
    else {
        response.data.isLoggedIn = true;
        AsyncStorage.setItem("userProfile", JSON.stringify(response.data));
        config().setUserID(response.data["_id"]);
        updateUserSuccess(dispatch, response.data);
        if (response.msg) {
            Alert.alert("Success", response.msg);
        }
    }
}

