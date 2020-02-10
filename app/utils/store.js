import {applyMiddleware, createStore} from "redux";
import {persistStore} from "redux-persist";
import thunk from "redux-thunk";
import logger from "redux-logger";
import {DEBUG_MODE} from "../../config/config";
import rootReducer from "../reducers/index";
import FilesystemStorage from "redux-persist-filesystem-storage";
import RNFetchBlob from "react-native-fetch-blob";
import TrackingMiddleware from "./TrackingMiddleware";

export default function configureStore() {
    const store = DEBUG_MODE ? createStore(
        rootReducer,
        applyMiddleware(thunk, TrackingMiddleware, logger)
    ) : createStore(
        rootReducer,
        applyMiddleware(thunk, TrackingMiddleware)
    );

    persistStore(
        store,
        {
            storage: FilesystemStorage.config({
                storagePath: `${RNFetchBlob.fs.dirs.DocumentDir}/persistStore`
            })
        }
    );

    return store;
}
