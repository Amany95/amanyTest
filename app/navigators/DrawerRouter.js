import config from "../../config/config";
import {StackNavigator} from "react-navigation";
import {ifIphoneX} from "react-native-iphone-x-helper";

import routeConfig from "./routeConfig";
import SideBar from "../components/drawer/views/SideBar";
import SimpleDrawer from "../components/drawer/SimpleDrawer";

const defaultStackNavigatorOptions = {
    headerMode: "screen",
    navigationOptions: () => {
        return {
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerPressColorAndroid: config().DefaultRippleColor,
            headerTintColor: config().DEFAULT_NAVBAR_TITLE_COLOR,
            headerRight: null,
            headerBackTitle: null
        }
    },
    cardStyle: {
        backgroundColor: config().DEFAULT_BACKGROUND_COLOR
    }
};

const defaultDrawerNavigatorOptions = {
    drawerOpenRoute: "DrawerOpen",
    drawerCloseRoute: "DrawerClose",
    drawerToggleRoute: "DrawerToggle",
    drawerMode: "amazing",
    contentComponent: SideBar,
    gesturesEnabled: false,
    drawerOpacity: 0.2,
    initialRouteName: "Home"
};

const defaultDrawerStack = {};
routeConfig().ROUTE_PAGES.forEach((route) => {
    defaultDrawerStack[route.routeName] = {
        screen: route.screen
    };
});

const drawerStack = StackNavigator(defaultDrawerStack, defaultStackNavigatorOptions);

export const drawerNavigator = SimpleDrawer({
    Home: {
        screen: drawerStack
    }
}, defaultDrawerNavigatorOptions);

const styles = {
    headerStyle: {
        backgroundColor: config().DEFAULT_NAVBAR_COLOR,
        ...ifIphoneX({
            height: 64,
            paddingTop:16
        }, {

        })
    },
    headerTitleStyle: {
        color: config().DEFAULT_NAVBAR_TITLE_COLOR
    }
};
