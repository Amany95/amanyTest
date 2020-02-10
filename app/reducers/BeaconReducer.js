import {
    BEACON_LIVE,
    BEACON_PARKING,
    BEACON_VISITED,
    BEACON_VISITED_SHOWED,
    DEFAULT_BEACON_DATA, DEFAULT_NODES_DATA
} from "../actions/types";
import BeaconManager from "../utils/beacon/BeaconManager";

const INITIAL_STATE = {
    visited: null,
    live: null,
    parking: null,
    beaconData: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case BEACON_VISITED:
            return {...state, visited: action.payload};
        case BEACON_LIVE:
            return {...state, live: action.payload};
        case BEACON_PARKING:
            return {...state, parking: action.payload};
        case BEACON_VISITED_SHOWED:
            return {...state, visited: null};
        case DEFAULT_BEACON_DATA:
            BeaconManager.beaconLevelData(action.payload);
            return {...state, beaconData: action.payload};
        case DEFAULT_NODES_DATA:
            BeaconManager.setNodesData(action.payload);
            return {...state, nodesData: action.payload};
        default:
            return state;
    }
};


