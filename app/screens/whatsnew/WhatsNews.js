import React from "react";
import {TouchableOpacity, View} from "react-native";
import {connect} from "react-redux";
import {CachedImage} from "react-native-img-cache";
import PropTypes from "prop-types";

import {translateText} from "../../translation/translate";
import {NewListItem} from "../../components/new/NewListItem";
import {GridView} from "../../components/common";

class WhatsNews extends React.Component {
	static navigationOptions = ({navigation}) => {
		const {state} = navigation;
		if (state.params && state.params.type === "REPLACE") {
			return {
				title: translateText("WhatsNews").toUpperCase(),
				headerLeft: <TouchableOpacity onPress={() => {
					navigation.navigate("DrawerOpen");
				}}>
					<CachedImage source={require("../../../assets/icons/menu-icon.png")}
					             style={{width: 20, height: 20, margin: 15}}
					/>
				</TouchableOpacity>
			};
		}
		return {
			title: translateText("WhatsNews").toUpperCase()
		};
	};

	componentDidMount() {
		if (this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.notification) {

			const {whatsNew} = this.props.navigation.state.params;
			let navigateWhatsNew = {};

			this.props.new.map((whatsNewArray) => {
				const isTrue = whatsNewArray._id === whatsNew;
				if (isTrue) {
					navigateWhatsNew = whatsNewArray;
				}
				return whatsNewArray;
			});

			this.props.navigation.navigate("WhatsNewDetail", {
				whatsNew: navigateWhatsNew,
				title: navigateWhatsNew.title
			});
		}
	}

	renderItem = (item) => {

		return (
			<NewListItem item={item} onPress={() => {
				this.props.navigation.navigate("WhatsNewDetail", {
					whatsNew: item,
					title: item.title
				});
			}}/>
		);
	};

	render() {
		if (this.props.new) {
			return (
				<GridView
					items={this.props.new}
					itemsPerRow={2}
					renderItem={this.renderItem}
				/>
			);
		}
		else {
			return (
				<View>

				</View>
			);
		}
	}
}

const mapStateToProps = ({main, auth}) => {
	const {payload} = main;
	const {user} = auth;

	if (payload !== null) {
		payload.news.forEach((object) => {
			if (user && user.isLoggedIn) {
				let match = user["favorite_news"].find((obj) => {
					return obj["s"] === object["_id"];
				});
				object["fav"] = !!match;
				object["userid"] = user["_id"];
			}
			else {
				object["fav"] = false;
				object["userid"] = null;
			}

			object.store = payload.stores.filter((store) => {
				return store._id === object.store_id;
			})[0];

			if (object.store) {
				if (user && user.isLoggedIn) {
					let match = user["favorite_stores"].find((obj) => {
						return obj["s"] === object.store["_id"];
					});

					object.store["fav"] = !!match;
					object.store["userid"] = user["_id"];
				}
				else {
					object.store["fav"] = false;
					object.store["userid"] = null;
				}
			}
		});
		return {
			new: payload.news
		};
	}

	return {new: null};
};

WhatsNews.propTypes = {
	new: PropTypes.instanceOf(Array),
	navigation: PropTypes.instanceOf(Object)
};

const WhatsNewsRedux = connect(mapStateToProps)(WhatsNews);

export {WhatsNewsRedux as WhatsNews};
