import {
	EMAIL_CHANGED,
	EMAIL_ERROR, LOADING_REGISTER,
	LOGIN_FACEBOOK_USER,
	LOGIN_USER,
	LOGIN_USER_FAIL,
	LOGIN_USER_SUCCESS,
	PASSWORD_CHANGED,
	PASSWORD_ERROR, REGISTER_COMPLETED,
	USER_LOGOUT
} from "../actions/types";

const INITIAL_STATE = {
	email: "",
	password: "",
	email_error: "",
	password_error: "",
	user: null,
	loading: false
};

export default (state = INITIAL_STATE, action) => {
 
	switch (action.type) {
		case EMAIL_CHANGED:
			return {...state, email: action.payload, email_error: ""};
		case PASSWORD_CHANGED:
			return {...state, password: action.payload, password_error: ""};
		case EMAIL_ERROR:
			return {...state, email_error: action.payload};
		case PASSWORD_ERROR:
			return {...state, password_error: action.payload};
		case LOGIN_USER:
			return {...state, loading: true, error: ""};
		case LOGIN_FACEBOOK_USER:
			return {...state, user: action.payload};
		case LOGIN_USER_SUCCESS:
			return {...state, ...INITIAL_STATE, user: action.payload};
		case LOGIN_USER_FAIL:
			return {...state, error: "Authentication Failed.", password: "", loading: false};
		case LOADING_REGISTER:
			return {...state, loading: true};
		case REGISTER_COMPLETED:
			return {...state, loading: false};
		case USER_LOGOUT:
			return {...state, user: null};
		default:
			return state;
	}
};
