import {CHECK_SERVER, CONNECTION_STATUS, LOAD_SERVER_FAIL, LOAD_SERVER_SUCCESS} from "../actions/types";

const INITIAL_STATE = {
    error: null,
    loading: false,
    connection: true,
    appLoadedSuccessfully: false,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CHECK_SERVER:
            return {...state, loading: true, error: null};
        case LOAD_SERVER_SUCCESS:
            return {...state, loading: false, error: null, payload: action.payload, appLoadedSuccessfully: true};
        case LOAD_SERVER_FAIL:
            return {...state, loading: false, error: action.error === "" ? null : action.error, payload: null};
        case CONNECTION_STATUS:
            return {...state, connection: action.payload};
        default:
            return state;
    }
};

