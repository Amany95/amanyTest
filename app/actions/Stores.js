import {FILTER_STORES, SEARCH_TERM} from "./types";


export const filterStores = (stores, searchTerm) => {
    return (dispatch) => {
        dispatch({
            type: FILTER_STORES,

        })
    }
};

export const SearchTerm = (searchTerm) => {
    return (dispatch) => {
        dispatch({
            type: SEARCH_TERM,
            searchTerm
        })
    }
};