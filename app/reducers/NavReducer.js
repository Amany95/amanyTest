import {BackHandler} from "react-native";
import nav from "../navigators/Main";

export function getActiveState(param, parent) {
	const state = param;
	if (!state.routes) {
		return {...state, parent};
	}
	return getActiveState(state.routes[state.index], {...state, parent});
}

export function inject(state, key, index, routes) {
	if (!state.routes) {
		return state;
	}
	if (state.key === key) {
		if (routes) {
			return {...state, routes, index};
		}
		return {...state, index};
	}
	return {...state, routes: state.routes.map(x => inject(x, key, index, routes))};
}

export function popPrevious(state) {
	const activeState = getActiveState(state);
	if (activeState.parent && activeState.parent.index) {
		const parent = activeState.parent;
		const key = parent.key;
		const routes = [...parent.routes.slice(0, parent.index - 1), ...parent.routes.slice(parent.index)];
		return inject(state, key, parent.index - 1, routes);
	}
	return state;
}

export const NavReducer = (state, action) => {
	let newState;

	newState = nav.router.getStateForAction(action, state);

	if (action.type === "Navigation/BACK" && state === newState) {
		BackHandler.exitApp();
	}

	if (action.params && action.params.type === "REPLACE") {
		return popPrevious(newState);
	}

	return newState || state;
};
