import {
    AboutUs,
    AboutUsDetail,
    AudioRecord,
    Browser,
    CafeRestaurants,
    Cinema,
    CinemaDetail,
    CinemaStores,
    Contact,
    Dining,
    Entertainment,
    EventDetail,
    Events,
    Fashion,
    ForgetPassword,
    Home,
    Hotels,
    Offices,
    ImagePick,
    LocateWithBluetooth,
    Magazine,
    MagazineDetail,
    MallMap,
    OfferDetail,
    Offers,
    Parking,
    Profile,
    QrCode,
    QrCodeHelpPage,
    QrCodeScanner,
    QrIdentity,
    Register,
    ServiceDetail,
    Services,
    StoreDetail,
    StoreImageGallery,
	Notifications,
    StoreListSubCategory,
    StoresList,
    storesPager,
    TenantPlatform,
    TermAndConditions,
    UpdateProfile,
    Wayfinder,
    WayfinderStoreList,
    WhatsNewDetail,
    WhatsNews,
    Emergency
} from "../screens/index";

export default () => {
    return ({
        /**
         *
         * Load Route Page
         */

        ROUTE_PAGES: [{
            name: "Home",
            routeName: "Home",
            drawer_component: true,
            screen: Home,
            icon: require("../../assets/icons/home_menu_icon.png")
        }, {
            name: "Directory",
            routeName: "Brands",
            drawer_component: true,
            screen: storesPager,
            icon: require("../../assets/icons/home_brands_icon.png")

        }, {
            name: "Fashion",
            routeName: "Fashion",
            drawer_component: true,
            icon: require("../../assets/icons/home_fashion_icon.png"),
            screen: Fashion
        }, {
            name: "Dining",
            routeName: "Dining",
            icon: require("../../assets/icons/home_food_icon.png"),
            drawer_component: true,
            screen: Dining
        }, {
            name: "Entertainment",
            routeName: "Entertainment",
            icon: require("../../assets/icons/home_fun_icon.png"),
            drawer_component: true,
            screen: Entertainment
        }, {
            name: "Events",
            routeName: "Events",
            icon: require("../../assets/icons/home_events_icon.png"),
            drawer_component: true,
            screen: Events
        }, {
            name: "Offers",
            routeName: "Offers",
            icon: require("../../assets/icons/home_promos_icon.png"),
            drawer_component: true,
            screen: Offers
        }, {
            name: "WhatsNews",
            routeName: "WhatsNews",
            icon: require("../../assets/icons/home_news_icon.png"),
            drawer_component: true,
            screen: WhatsNews
        }, {
            name: "Cinema",
            routeName: "Cinema",
            screen: Cinema
        }, {
            name: "Cinema",
            icon: require("../../assets/icons/home_cinema_icon.png"),
            routeName: "CinemaStores",
            drawer_component: true,
            screen: CinemaStores
        }, {
            name: "Magazine",
            routeName: "Magazine",
            drawer_component: true,
            icon: require("../../assets/icons/home_magazine_icon.png"),
            screen: Magazine
        }, {
            name: "MallMap",
            routeName: "MallMap",
            drawer_component: true,
            icon: require("../../assets/icons/home_mallmap_icon.png"),
            screen: MallMap
        }, {
            name: "Wayfinder",
            routeName: "Wayfinder",
            drawer_component: true,
            icon: require("../../assets/icons/home_wayfinder_icon.png"),
            screen: Wayfinder
        }, {
            name: "Services",
            routeName: "Services",
            drawer_component: true,
            icon: require("../../assets/icons/home_service_icon.png"),
            screen: Services
        }, {
            name: "Parking",
            routeName: "Parking",
            drawer_component: true,
            icon: require("../../assets/icons/home_park_icon.png"),
            screen: Parking
        }, {
            name: "Hotels",
            routeName: "Hotels",
            drawer_component: true,
            icon: require("../../assets/icons/home_hotel_icon.png"),
            screen: Hotels
        }, {
            name: "Offices",
            routeName: "Offices",
            drawer_component: true,
            icon: require("../../assets/icons/startscapital.png"),
            screen: Offices
        }, {
            name: "ContactUs",
            routeName: "ContactUs",
            screen: Contact,
            icon: require("../../assets/icons/home_contact_icon.png"),
            drawer_component: true
        }, {
            name: "AboutUs",
            routeName: "AboutUs",
            screen: AboutUs,
            icon: require("../../assets/icons/home_corporate_icon.png"),
            drawer_component: true
        }, {
            name: "TenantPlatform",
            routeName: "TenantPlatform",
            screen: TenantPlatform,
            icon: require("../../assets/icons/home_insiders_icon.png"),
            drawer_component: true

        }, {
            name: "Offer Detail",
            routeName: "OfferDetail",
            screen: OfferDetail
        }, {
            name: "WhatsNewDetail",
            routeName: "WhatsNewDetail",
            screen: WhatsNewDetail
        }, {
            name: "CafeRestaurants",
            routeName: "CafeRestaurants",
            screen: CafeRestaurants
        }, {
            name: "Cinema Detail",
            routeName: "CinemaDetail",
            screen: CinemaDetail
        }, {
            name: "Store Detail",
            routeName: "StoreDetail",
            screen: StoreDetail
        }, {
            name: "Store List",
            routeName: "StoresList",
            screen: StoresList
        }, {
            name: "Stores List Sub Category",
            routeName: "StoresListSubCategory",
            screen: StoreListSubCategory
        }, {
            name: "Event Detail",
            routeName: "EventDetail",
            screen: EventDetail
        }, {
            name: "Picture /View",
            routeName: "PictureView",
            screen: ImagePick
        }, {
            name: "Voice Recorder",
            routeName: "VoiceRecord",
            screen: AudioRecord
        }, {
            name: "Profile",
            routeName: "Profile",
            screen: Profile
        }, {
            name: "Register",
            routeName: "Register",
            screen: Register
        }, {
            name: "Forget Password",
            routeName: "ForgetPassword",
            screen: ForgetPassword
        }, {
            name: "Update Profile",
            routeName: "UpdateProfile",
            screen: UpdateProfile
        }, {
            name: "Service Detail",
            routeName: "ServiceDetail",
            screen: ServiceDetail
        }, {
            name: "Term & Conditions",
            routeName: "TermAndConditions",
            screen: TermAndConditions
        }, {
            name: "Way finder StoreList",
            routeName: "WayfinderStoreList",
            screen: WayfinderStoreList
        }, {
            name: "MagazineDetail",
            routeName: "MagazineDetail",
            screen: MagazineDetail
        }, {
            name: "AboutUsDetail",
            routeName: "AboutUsDetail",
            screen: AboutUsDetail
        }, {
            name: "QrIdentity",
            routeName: "QrIdentity",
            screen: QrIdentity
        }, {
            name: "Browser",
            routeName: "Browser",
            screen: Browser
        }, {
            name: "StoreImageGallery",
            routeName: "StoreImageGallery",
            screen: StoreImageGallery
        }, {
            name: "QrCode",
            routeName: "QrCode",
            screen: QrCode
        }, {
            name: "LocateWithBluetooth",
            routeName: "LocateWithBluetooth",
            screen: LocateWithBluetooth
        }, {
            name: "QrCodeHelpPage",
            routeName: "QrCodeHelpPage",
            screen: QrCodeHelpPage
        }, {
            name: "QrCodeScanner",
            routeName: "QrCodeScanner",
            screen: QrCodeScanner
        }, {
            name: "Notifications",
            routeName: "Notifications",
            screen: Notifications
        }, {
            name: "Emergency",
            routeName: "Emergency",
            drawer_component: true,
            icon: require("../../assets/icons/startscapital.png"),
            screen: Emergency
        }
        ]
    })
}
