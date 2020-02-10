import {BLUETOOTH_STATUS} from '../actions/types';

const INITIAL_STATE = {
    enabled: false,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case BLUETOOTH_STATUS:
            return {...state, enabled: action.payload};
        default:
            return state;
    }
};




