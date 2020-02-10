import {Platform} from "react-native";
import {GoogleAnalyticsTracker} from "react-native-google-analytics-bridge";

const tracker = new GoogleAnalyticsTracker("UA-99736701-1");
tracker.setAppName("Citystars");

export default () => (next) => (action) => {

    if (action.type === "Navigation/NAVIGATE") {
        // console.log("action", action);

        trackPage(action.routeName, action.params);
    }

    return next(action);
};

function trackPage(routeName: string, state: any) {
    if (routeName === "Brands") {
        tracker.trackEvent(Platform.OS, "Directory");
    }
    else if (routeName === "CinemaStores") {
        tracker.trackEvent(Platform.OS, "Cinema");
    }
    else if (routeName === "Fashion") {
        tracker.trackEvent(Platform.OS, "Fashion");
    }
    else if (routeName === "Dining") {
        tracker.trackEvent(Platform.OS, "Dining");
    }
    else if (routeName === "Entertainment") {
        tracker.trackEvent(Platform.OS, "Entertainment");
    }
    else if (routeName === "Wayfinder") {
        tracker.trackEvent(Platform.OS, "Wayfinder");
    }
    else if (routeName === "MallMap") {
        tracker.trackEvent(Platform.OS, "Mall Map");
    }
    else if (routeName === "Parking") {
        tracker.trackEvent(Platform.OS, "Parking");
    }
    else if (routeName === "Hotels") {
        tracker.trackEvent(Platform.OS, "Hotels");
    }
    else if (routeName === "Services") {
        tracker.trackEvent(Platform.OS, "Services");
    }
    else if (routeName === "Events") {
        tracker.trackEvent(Platform.OS, "Events");
    }
    else if (routeName === "Offers") {
        tracker.trackEvent(Platform.OS, "Offers");
    }
    else if (routeName === "WhatsNews") {
        tracker.trackEvent(Platform.OS, "WhatsNew");
    }
    else if (routeName === "StoreDetail") {
        tracker.trackEvent(Platform.OS, "Store Detail", {
                label: state.data.name_en
            }
        );
    }
    else if (routeName === "EventDetail") {
        tracker.trackEvent(Platform.OS, "Event Detail", {
                label: state.event.title.en
            }
        );
    }
    else if (routeName === "OfferDetail") {
        tracker.trackEvent(Platform.OS, "Offer Detail", {
                label: state.offer.title.en
            }
        );
    }
    else if (routeName === "WhatsNewDetail") {
        tracker.trackEvent(Platform.OS, "WhatsNew Detail", {
                label: state.whatsNew.title.en
            }
        );
    }
    else if (routeName === "CinemaDetail") {
        tracker.trackEvent(Platform.OS, "Movie Detail", {
                label: state.data.item.title.en
            }
        );
    }
    else if (routeName === "ServiceDetail") {
        tracker.trackEvent(Platform.OS, "Service Detail", {
                label: state.data.name.en
            }
        );
    }

}
