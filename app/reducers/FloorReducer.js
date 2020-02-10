import {NEW_SP} from "../actions/types";

const INITIAL_STATE = {
    sp: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case NEW_SP:
            return {...state, sp: action.payload};
        default:
            return state;
    }
};


