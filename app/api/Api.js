/* eslint-disable prefer-template */
import config from "../../config/config";

class Api {
    static init = (data) => {

        return {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                info: config().INFO_DATA,
                data: data
            })
        };
    };

    static NewSP(data = {}) {
        // console.log("NewSP");
        return fetch(config().API_URL + "sp", this.init(data)).then((response) => {
            return response.json();
        });
    }

    static NewGeofence(data = {}) {
        return fetch(config().API_URL + "geofence", this.init(data)).then((response) => {
            return response.json();
        });
    }

    static BeaconVisited(data = {}) {
        return fetch(config().API_URL + "beacons/visited", this.init(data)).then((response) => {
            return response.json();
        });
    }

    static BeaconParking(data = {}) {
        return fetch(config().API_URL + "beacons/parking", this.init(data)).then((response) => {
            return response.json();
        }).catch((error) => {
            // console.log("error", error);

        });
    }

    static BeaconLive(data = {}) {
        // console.log("BeaconLive");
        return fetch(config().API_URL + "beacons/live", this.init(data)).then((response) => {
            return response.json();
        });
    }

    static AllBeacon(data = {}) {
        return fetch(config().API_URL + "beacons/all", this.init(data)).then((response) => {
            return response.json();
        });
    }

    static AllNodes(data = {}) {
        return fetch(config().API_URL + "nodes/all", this.init(data)).then((response) => {
            return response.json();
        });
    }

    static ForgetPassword(email = "") {
        return fetch(config().API_URL + "user/password/forget", this.init({email})).then((response) => {
            return response.json();
        });
    }

    static LoginUser(data = {}) {
        return fetch(config().API_URL + "user/login/email", this.init(data)).then((response) => {
            return response.json();
        });
    }

    static LogoutUser(userid, data = {}) {
        return fetch(config().API_URL + `user/${userid}/logout`, this.init(data)).then((response) => {
            return response.json();
        });
    }

    static RegisterUser(data = {}) {
        // console.log("RegisterUser");
        return fetch(config().API_URL + "user/register", this.init(data)).then((response) => {
            return response.json();
        });
    }

    static LoginWithFacebook(response, infoResponse) {
        const data = {
            "email": infoResponse.email,
            "type": "facebook",
            "social_token": response.authResponse.accessToken,
            "raw": {
                "first_name": infoResponse.first_name,
                "last_name": infoResponse.last_name,
                "gender": infoResponse.gender,
                "id": infoResponse.id,
                "image": infoResponse.cover && infoResponse.cover.source ? infoResponse.cover.source : "",
                "link": infoResponse.link
            }
        };

        return fetch(config().API_URL + "user/login/social", this.init(data)).then((response) => {
            return response.json();
        });
    }

    static AddFavorite(userid, data = {}) {
        // console.log("AddFavorite");
        return fetch(config().API_URL + "user/" + userid + "/favorite/add", this.init(data)).then((response) => {
            return response.json();
        });
    }

    static RemoveFavorite(userid, data = {}) {
        // console.log("RemoveFavorite");
        return fetch(config().API_URL + "user/" + userid + "/favorite/remove", this.init(data)).then((response) => {
            return response.json();
        });
    }

    static UpdateUser(data = {}, userProfile) {
        // console.log("UpdateUser");
        this.init = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                info: config().INFO_DATA,
                data: data
            })
        };
        return fetch(config().API_URL + "user/" + userProfile["_id"] + "/update", this.init).then((response) => {
            return response.json();
        });
    }

    static saveImage(userid, data) {
        // console.log("saveImage");

        if (!data.hasOwnProperty("fileName")) {
            data["fileName"] = new Date().getTime().toString() + ".JPG";
        }

        const form = new FormData();
        form.append("language", "en");
        form.append("profile-picture", {
            uri: data.uri,
            name: data.fileName,
            type: data.type
        });

        let request = {
            method: "POST",
            header: {
                "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW"
            },
            body: form
        };
        return fetch(config().API_URL + "user/" + userid + "/upload/profile-picture", request).then((response) => {
            return response.json();
        });
    }

    static getAll(version = {}) {

        const init = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                info: config().INFO_DATA,
                version: version
            })
        };

        return fetch(config().API_URL + "all", init).then((response) => {
            return response.json();
        }).catch(() => {
            return false;
        });
    }

    static setLanguage(data) {

        return fetch(config().API_URL + "language", this.init(data)).then((response) => {
            return response.json();
        });
    }

    static emergencyBtn(data){

        return fetch(config().API_URL + "user/ryyNcMepZ/emergency", this.init(data)).then((response) => {
            return response.json();
        });
    }
}

export default Api;
