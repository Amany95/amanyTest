import {RECEIVED_NOTIFICATION, VIEWED_NOTIFICATION} from "./types";

export const NotificationReceived = (data) => {
	// // console.log(data);
	return ((dispatch) => {
		dispatch({
			type: RECEIVED_NOTIFICATION,
			payload: data
		});
	});
};

export const NotificationViewed = () => {
	return ((dispatch) => {
		dispatch({
			type: VIEWED_NOTIFICATION
		});
	});
};
