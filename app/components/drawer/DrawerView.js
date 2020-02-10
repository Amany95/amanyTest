import React from "react";

import {Dimensions} from 'react-native';

import type {
    NavigationDrawerScreenOptions,
    NavigationRouter,
    NavigationScreenProp,
    NavigationState,
    NavigationStateRoute,
    ViewStyleProp,
} from "../../../node_modules/react-navigation/src/TypeDefinition";
import DrawerSidebar from "react-navigation/src/views/Drawer/DrawerSidebar";
import addNavigationHelpers from "react-navigation/src/addNavigationHelpers";
import DrawerLayout from "./views/DrawerLayout";

export type DrawerViewConfig = {
    drawerLockMode?: 'unlocked' | 'locked-closed' | 'locked-open',
    drawerWidth?: number | (() => number),
    drawerPosition?: 'left' | 'right',
    drawerOpenRoute: string,
    drawerCloseRoute: string,
    drawerToggleRoute: string,
    contentComponent?: React.ComponentType<*>,
    contentOptions?: {},
    style?: ViewStyleProp,
    useNativeAnimations?: boolean,
    drawerBackgroundColor?: string,
    screenProps?: {},
    drawerMode?: 'default' | 'facebook',
    drawerOpacity?: number | (() => number),
};

export type DrawerViewPropsExceptRouter = DrawerViewConfig & {
    navigation: NavigationScreenProp<NavigationState>,
};

export type DrawerViewProps = DrawerViewPropsExceptRouter & {
    router: NavigationRouter<NavigationState, NavigationDrawerScreenOptions>,
};

type DrawerViewState = {
    drawerWidth?: number,
};

export default class DrawerView extends React.PureComponent<DrawerViewProps,
    DrawerViewState> {
    state: DrawerViewState = {
        drawerWidth:
            typeof this.props.drawerWidth === 'function'
                ? this.props.drawerWidth()
                : this.props.drawerWidth,
    };

    componentWillMount() {
        this._updateScreenNavigation(this.props.navigation);

        Dimensions.addEventListener('change', this._updateWidth);
    }

    componentWillUnmount() {
        Dimensions.removeEventListener('change', this._updateWidth);
    }

    componentWillReceiveProps(nextProps: DrawerViewProps) {
        if (
            this.props.navigation.state.index !== nextProps.navigation.state.index
        ) {
            const {
                drawerOpenRoute,
                drawerCloseRoute,
                drawerToggleRoute,
            } = this.props;
            const {routes, index} = nextProps.navigation.state;
            if (routes[index].routeName === drawerOpenRoute) {
                this._drawer.openDrawer();
            } else if (routes[index].routeName === drawerToggleRoute) {
                if (this._drawer.state.drawerShown) {
                    this.props.navigation.navigate(drawerCloseRoute);
                } else {
                    this.props.navigation.navigate(drawerOpenRoute);
                }
            } else {
                this._drawer.closeDrawer();
            }
        }
        this._updateScreenNavigation(nextProps.navigation);
    }

    _screenNavigationProp: NavigationScreenProp<NavigationStateRoute>;

    _handleDrawerOpen = () => {
        const {navigation, drawerOpenRoute} = this.props;
        const {routes, index} = navigation.state;
        if (routes[index].routeName !== drawerOpenRoute) {
            this.props.navigation.navigate(drawerOpenRoute);
        }
    };

    _handleDrawerClose = () => {
        const {navigation, drawerCloseRoute} = this.props;
        const {routes, index} = navigation.state;
        if (routes[index].routeName !== drawerCloseRoute) {
            this.props.navigation.navigate(drawerCloseRoute);
        }
    };

    _updateScreenNavigation = (navigation: NavigationScreenProp<NavigationState>) => {
        const {drawerCloseRoute} = this.props;
        // $FlowFixMe there's no way type the specific shape of the nav state
        const navigationState: NavigationStateRoute = navigation.state.routes.find(
            (route: *) => route.routeName === drawerCloseRoute
        );
        if (
            this._screenNavigationProp &&
            this._screenNavigationProp.state === navigationState
        ) {
            return;
        }
        this._screenNavigationProp = addNavigationHelpers({
            dispatch: navigation.dispatch,
            state: navigationState,
        });
    };

    _updateWidth = () => {
        const drawerWidth =
            typeof this.props.drawerWidth === 'function'
                ? this.props.drawerWidth()
                : this.props.drawerWidth;

        if (this.state.drawerWidth !== drawerWidth) {
            this.setState({drawerWidth});
        }
    };

    _getNavigationState = (navigation: NavigationScreenProp<NavigationState>) => {
        const {drawerCloseRoute} = this.props;
        return navigation.state.routes.find(
            (route: *) => route.routeName === drawerCloseRoute
        );
    };

    _renderNavigationView = () => (
        <DrawerSidebar
            screenProps={this.props.screenProps}
            navigation={this._screenNavigationProp}
            router={this.props.router}
            contentComponent={this.props.contentComponent}
            contentOptions={this.props.contentOptions}
            drawerPosition={this.props.drawerPosition}
            style={this.props.style}
        />
    );

    _drawer: any;

    render() {
        const DrawerScreen = this.props.router.getComponentForRouteName(
            this.props.drawerCloseRoute
        );

        const screenNavigation = addNavigationHelpers({
            state: this._screenNavigationProp.state,
            dispatch: this._screenNavigationProp.dispatch,
        });

        const config = this.props.router.getScreenOptions(
            screenNavigation,
            this.props.screenProps
        );

        return (
            <DrawerLayout
                ref={(c: *) => {
                    this._drawer = c;
                }}
                drawerLockMode={
                    (this.props.screenProps && this.props.screenProps.drawerLockMode) ||
                    (config && config.drawerLockMode)
                }
                drawerBackgroundColor={this.props.drawerBackgroundColor}
                drawerWidth={this.state.drawerWidth}
                onDrawerOpen={this._handleDrawerOpen}
                onDrawerClose={this._handleDrawerClose}
                useNativeAnimations={this.props.drawerMode === 'default' ? this.props.useNativeAnimations : false}
                drawerMode={this.props.drawerMode}
                renderNavigationView={this._renderNavigationView}
                drawerOpacity={this.props.drawerOpacity}
                drawerPosition={
                    this.props.drawerPosition === 'right'
                        ? DrawerLayout.positions.Right
                        : DrawerLayout.positions.Left
                }
            >
                <DrawerScreen
                    screenProps={this.props.screenProps}
                    navigation={this._screenNavigationProp}
                />
            </DrawerLayout>
        );
    }
}
