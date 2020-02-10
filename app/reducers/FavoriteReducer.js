import {ADD_FAVORITE, FAV_SUCCESS,} from '../actions/types';

const INITIAL_STATE = {
    loading: false,
    error: '',
    data: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ADD_FAVORITE:
            return {...state, loading: true, error: ''};
        case FAV_SUCCESS:
            return {...state, data: action.payload};
        default:
            return state;
    }
};