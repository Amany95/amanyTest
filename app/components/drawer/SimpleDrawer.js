/* @flow */

import * as React from "react";
import {Dimensions, Platform, ScrollView} from "react-native";

import {createNavigationContainer, createNavigator, DrawerItems, SafeAreaView, TabRouter} from "react-navigation";
import type {
	NavigationDrawerScreenOptions,
	NavigationNavigatorProps,
	NavigationRouteConfigMap,
	NavigationState,
	NavigationTabRouterConfig
} from "../../../node_modules/react-navigation/src/TypeDefinition";
import type {DrawerViewConfig} from "../../../node_modules/react-navigation/src/views/Drawer/DrawerView";
import NavigatorTypes from "react-navigation/src/navigators/NavigatorTypes";
import DrawerScreen from "react-navigation/src/views/Drawer/DrawerScreen";
import DrawerView from "./DrawerView";

export type DrawerNavigatorConfig = {
	containerConfig?: void,
} & NavigationTabRouterConfig &
	DrawerViewConfig;

// A stack navigators props are the intersection between
// the base navigator props (navgiation, screenProps, etc)
// and the view's props
type DrawerNavigatorProps = NavigationNavigatorProps<NavigationDrawerScreenOptions,
	NavigationState> &
	React.ElementProps<typeof DrawerView>;

const defaultContentComponent = (props: React.ElementProps<typeof DrawerItems>) => (
	<ScrollView alwaysBounceVertical={true}>
		<SafeAreaView forceInset={{top: "always", horizontal: "never"}}>
			<DrawerItems {...props} />
		</SafeAreaView>
	</ScrollView>
);

const DefaultDrawerConfig = {
	drawerWidth: () => {
		/*
		 * Default drawer width is screen width - header height
		 * with a max width of 280 on mobile and 320 on tablet
		 * https://material.io/guidelines/patterns/navigation-drawer.html
		 */
		const {height, width} = Dimensions.get("window");
		const smallerAxisSize = Math.min(height, width);
		const isLandscape = width > height;
		const isTablet = smallerAxisSize >= 600;
		const appBarHeight = Platform.OS === "ios" ? (isLandscape ? 32 : 44) : 56;
		const maxWidth = isTablet ? 320 : 280;

		return Math.min(smallerAxisSize - appBarHeight, maxWidth);
	},
	contentComponent: defaultContentComponent,
	drawerPosition: "left",
	drawerBackgroundColor: "white",
	useNativeAnimations: true,
	drawerMode: "default"
};

const DrawerNavigator = (routeConfigs: NavigationRouteConfigMap,
                         config: DrawerNavigatorConfig = {
	                         drawerOpenRoute: "DrawerOpen",
	                         drawerCloseRoute: "DrawerClose",
	                         drawerToggleRoute: "DrawerToggle"
                         }) => {
	const mergedConfig = {...DefaultDrawerConfig, ...config};
	const {
		drawerWidth,
		drawerLockMode,
		contentComponent,
		contentOptions,
		drawerPosition,
		useNativeAnimations,
		drawerBackgroundColor,
		drawerOpenRoute,
		drawerCloseRoute,
		drawerToggleRoute,
		drawerMode,
		drawerOpacity,
		...tabsConfig
	} = mergedConfig;

	const contentRouter = TabRouter(routeConfigs, tabsConfig);

	const drawerRouter = TabRouter(
		{
			[drawerCloseRoute]: {
				screen: createNavigator(
					contentRouter,
					routeConfigs,
					config,
					NavigatorTypes.DRAWER
				)((props: React.ElementProps<typeof DrawerScreen>) => (
					<DrawerScreen {...props} />
				))
			},
			[drawerOpenRoute]: {
				screen: () => null
			},
			[drawerToggleRoute]: {
				screen: () => null
			}
		},
		{
			initialRouteName: drawerCloseRoute
		}
	);

	const navigator = createNavigator(
		drawerRouter,
		routeConfigs,
		config,
		NavigatorTypes.DRAWER
	)((props: DrawerNavigatorProps) => (
		<DrawerView
			{...props}
			drawerBackgroundColor={drawerBackgroundColor}
			drawerLockMode={drawerLockMode}
			useNativeAnimations={useNativeAnimations}
			drawerWidth={drawerWidth}
			contentComponent={contentComponent}
			contentOptions={contentOptions}
			drawerPosition={drawerPosition}
			drawerOpenRoute={drawerOpenRoute}
			drawerMode={drawerMode}
			drawerOpacity={drawerOpacity}
			drawerCloseRoute={drawerCloseRoute}
			drawerToggleRoute={drawerToggleRoute}
		/>
	));

	return createNavigationContainer(navigator);
};

export default DrawerNavigator;
