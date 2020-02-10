import {RECEIVED_NOTIFICATION, VIEWED_NOTIFICATION} from "../actions/types";

const INITIAL_STATE = {
    notification: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case RECEIVED_NOTIFICATION:
            return {notification: action.payload};
        case VIEWED_NOTIFICATION:
            return {notification: null};
        default:
            return state;
    }
};
