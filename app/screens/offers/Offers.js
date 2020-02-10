import React from "react";
import {TouchableOpacity, View} from "react-native";
import {connect} from "react-redux";
import {CachedImage} from "react-native-img-cache";
import {getDefaultLanguageText, translateText} from "../../translation/translate";
import {OfferListItem} from "../../components/offers/OfferListItem";
import {GridView} from "../../components/common";

class Offers extends React.Component {
	static navigationOptions = ({navigation}) => {
		const {state} = navigation;
		if (state.params && state.params.type === "REPLACE")
			return {
				title: translateText("Offers").toUpperCase(),
				headerLeft: <TouchableOpacity onPress={() => navigation.navigate("DrawerOpen")}>
					<CachedImage source={require("../../../assets/icons/menu-icon.png")} style={{width: 20, height: 20, margin: 15}}
					/>
				</TouchableOpacity>
			};
		return {
			title: translateText("Offers").toUpperCase()
		};
	};

	componentDidMount() {
		if (this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.notification) {
			const {offer} = this.props.navigation.state.params;
			let navigateOffer = false;

			this.props.promotions.filter(offerArray => {
				const isTrue = offerArray._id === offer;
				if (isTrue) {
					navigateOffer = offerArray;
				}
				return isTrue;
			});
			if (navigateOffer)
				this.props.navigation.navigate("OfferDetail", {
					offer: navigateOffer,
					title: navigateOffer.title
				});
		}
	}


	renderItem = (item) => {
		return (
			<OfferListItem offer={item} onPress={() => {
				this.props.navigation.navigate("OfferDetail", {
					offer: item,
					title: getDefaultLanguageText(item.title)
				});
			}}/>
		);
	};

	render() {
		if (this.props.promotions)
			return (
				<GridView
					items={this.props.promotions}
					itemsPerRow={2}
					renderItem={this.renderItem}
				/>
			);
		else
			return (
				<View>

				</View>
			);
	}
}

const mapStateToProps = ({main, auth}) => {
	const {payload} = main;
	const {user} = auth;

	// // console.log(user);
	if (payload !== null) {
		payload.promotions.forEach((object) => {
			if (user && user.isLoggedIn) {
				let match = user["favorite_offers"].find(function (obj) {
					return obj["s"] === object["_id"];
				});
				object["fav"] = !!match;
				object["userid"] = user["_id"];
			} else {
				object["fav"] = false;
				object["userid"] = null;
			}

			object.store = payload.stores.filter(store => store._id === object.store_id)[0];

			if (object.store)
				if (user !== null && user.isLoggedIn) {
					let match = user["favorite_stores"].find(function (obj) {
						return obj["s"] === object.store["_id"];
					});

					object.store["fav"] = !!match;
					object.store["userid"] = user["_id"];
				} else {
					object.store["fav"] = false;
					object.store["userid"] = null;
				}

		});
		return {
			promotions: payload.promotions
		};
	}

	return {promotions: null};
};

const OffersRedux = connect(mapStateToProps)(Offers);

export {OffersRedux as Offers};