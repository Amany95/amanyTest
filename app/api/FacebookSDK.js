import {AccessToken, GraphRequest, GraphRequestManager, LoginManager} from "react-native-fbsdk";
import mapObject from "fbjs/lib/mapObject";

const emptyFunction = () => {
};

let _authResponse = null;

async function loginWithFacebookSDK(options) {
    const scope = options || "public_profile";
    const permissions = scope.split(",");

    const loginResult = await LoginManager.logInWithReadPermissions(permissions);
    if (loginResult.isCancelled) {
        throw new Error("Canceled by user");
    }

    const accessToken = await AccessToken.getCurrentAccessToken();
    if (!accessToken) {
        throw new Error("No access token");
    }

    _authResponse = {
        userID: accessToken.userID, // FIXME: RNFBSDK bug: userId -> userID
        accessToken: accessToken.accessToken,
        expiresIn: Math.round((accessToken.expirationTime - Date.now()) / 1000)
    };
    return _authResponse;
}

const FacebookSDK = {
    login(callback, options) {
        loginWithFacebookSDK(options).then(
            (authResponse) => {
                return callback({authResponse})
            },
            (error) => {
                return callback({error})
            }
        );
    },

    logout() {
        LoginManager.logOut();
    },

    api: function (path, ...args) {
        const argByType = {};
        args.forEach((arg) => {
            argByType[typeof arg] = arg;
        });

        const httpMethod = (argByType.string || "get").toUpperCase();
        const params = argByType.object || {};
        const callback = argByType.function || emptyFunction;

        // FIXME: Move this into RNFBSDK
        // GraphRequest requires all parameters to be in {string: 'abc'}
        // or {uri: 'xyz'} format
        const parameters = mapObject(params, (value) => {
            return {string: value}
        });

        function processResponse(error, result) {
            // FIXME: RNFBSDK bug: result is Object on iOS and string on Android
            if (!error && typeof result === "string") {
                try {
                    result = JSON.parse(result);
                }
                catch (e) {
                    error = e;
                }
            }

            const data = error ? {error} : result;
            callback(data);
        }

        const request = new GraphRequest(
            path,
            {parameters, httpMethod},
            processResponse
        );
        new GraphRequestManager().addRequest(request).start();
    }
};

export default FacebookSDK;
