import {NEW_GEOFENCE} from "../actions/types";

const INITIAL_STATE = {
    geofence: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case NEW_GEOFENCE:
            return {...state, geofence: action.payload};
        default:
            return state;
    }
};


