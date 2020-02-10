import React from "react";
import {TouchableOpacity} from "react-native";
import {connect} from "react-redux";
import {CachedImage} from "react-native-img-cache";
import {getDefaultLanguageText, translateText} from "../../translation/translate";
import {GridView} from "../../components/common";
import {EventListItem} from "../../components/events";
import PropTypes from "prop-types";

class Events extends React.Component {
	static navigationOptions = ({navigation}) => {
		const {state} = navigation;
		if (state.params && state.params.type === "REPLACE")
			return {
				title: translateText("Events").toUpperCase(),
				headerLeft: <TouchableOpacity onPress={() => navigation.navigate("DrawerOpen")}>
					<CachedImage source={require("../../../assets/icons/menu-icon.png")} style={{width: 20, height: 20, margin: 15}}
					/>
				</TouchableOpacity>
			};
		return {
			title: translateText("Events").toUpperCase()
		};
	};

	componentDidMount() {
		if (this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.notification) {
			const {event} = this.props.navigation.state.params;
			let navigateEvent = false;

			this.props.events.filter(eventArray => {
				const isTrue = eventArray._id === event;
				if (isTrue) {
					navigateEvent = eventArray;
				}
				return isTrue;
			});
			if (navigateEvent)
				this.props.navigation.navigate("EventDetail", {
					event: navigateEvent,
					title: navigateEvent.title
				});
		}
	}


	renderItem = (item) => {
		return (
			<EventListItem event={item} onPress={() => {
				this.props.navigation.navigate("EventDetail", {
					event: item,
					title: getDefaultLanguageText(item.title)
				});
			}}/>
		);
	};

	render() {
		return (
			<GridView
				items={this.props.events}
				itemsPerRow={2}
				renderItem={this.renderItem}
			/>
		);
	}
}

const mapStateToProps = ({main, auth}) => {
	const {payload} = main;
	const {user} = auth;

	// // console.log(user);
	if (payload !== null) {
		payload.events.forEach((object) => {
			if (user && user.isLoggedIn) {
				let match = user["favorite_events"].find(function (obj) {
					return obj["s"] === object["_id"];
				});
				object["fav"] = !!match;
				object["userid"] = user["_id"];
			} else {
				object["fav"] = false;
				object["userid"] = null;
			}
		});
		return {
			events: payload.events
		};
	}

	return {events: null};
};

Events.propTypes = {
	events: PropTypes.array,
	navigation: PropTypes.object
};

const EventsRedux = connect(mapStateToProps)(Events);

export {EventsRedux as Events};