import {StackNavigator} from "react-navigation";
import config from "../../config/config";
import Splash from "../screens/Splash";
import {drawerNavigator} from "./DrawerRouter";

export default nav = StackNavigator({
    Splash: {
        screen: Splash
    },
    amazingDrawer: {
        screen: drawerNavigator
    }
}, {
    cardStyle: {
        backgroundColor: config().DEFAULT_BACKGROUND_COLOR
    },
    headerMode: "none",
    initialRouteName: "Splash"
});
