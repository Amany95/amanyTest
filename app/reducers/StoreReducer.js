import {FILTER_STORES, SEARCH_TERM} from "../actions/types";

const INITIAL_STATE = {
    filteredStores: null,
    searchTerm: ''
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FILTER_STORES:
            return {filteredStores: action.filteredStores};
        case SEARCH_TERM:
            return {searchTerm: action.searchTerm};
        default:
            return state;
    }
};
