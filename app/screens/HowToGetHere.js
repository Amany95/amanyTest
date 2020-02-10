import React, {PureComponent} from "react";
import {connect} from "react-redux";
import {ActivityIndicator, Dimensions, InteractionManager, StyleSheet, View} from "react-native";

import MapView from "react-native-maps";
import {getDefaultLanguageText} from "../translation/translate";

const {width, height} = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class HowToGetHere extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			renderPlaceholderOnly: true,
			region: {
				latitude: parseFloat(this.props.mall.latitude),
				longitude: parseFloat(this.props.mall.longitude),
				latitudeDelta: LATITUDE_DELTA,
				longitudeDelta: LONGITUDE_DELTA
			},
			coordinate: {
				latitude: parseFloat(this.props.mall.latitude),
				longitude: parseFloat(this.props.mall.longitude)
			},
			toolbarHackHeight: 0
		};
	}

	componentDidMount() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({renderPlaceholderOnly: false});
		});
	}

	_renderMarkers(name) {
		return (
			<MapView.Marker coordinate={this.state.coordinate} onPress={this._showToolbarHack}
			                title={name}/>
		);
	}

	_showToolbarHack = () => {
		let heightDiff = 0.5; // we don't want to change the height too much so keep it small. I've noticed 0.5 works best, as opposed to 0.1 doesn't work at all, and 0.5 is barely noticeable to the user.
		// switch the height between 0 and 0.5 and back.
		this.setState({
			toolbarHackHeight: this.state.toolbarHackHeight === heightDiff ? this.state.toolbarHackHeight - heightDiff : this.state.toolbarHackHeight + heightDiff
		});
	};

	render() {
		if (this.props.mall && !this.state.renderPlaceholderOnly) {
			return (
				<MapView
					liteMode={this.props.liteMode || false}
					region={this.state.region}
					style={[styles.map, {marginBottom: this.state.toolbarHackHeight}]}
					toolbarEnabled={true}
				>
					{this._renderMarkers(getDefaultLanguageText(this.props.mall.name))}
				</MapView>
			);
		}

		return (
			<View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
				<ActivityIndicator size='small' color='#222'/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	map: {
		flex: 1
	},
	button: {
		width: 80,
		paddingHorizontal: 12,
		alignItems: "center",
		marginHorizontal: 10
	},
	buttonContainer: {
		flexDirection: "row",
		marginVertical: 20,
		backgroundColor: "transparent"
	}
});

const mapStateToProps = (state) => {
	const {payload} = state.main;
	if (payload !== null) {
		return {
			mall: payload.mall
		};
	}
	return {mall: null};
};

export default connect(mapStateToProps)(HowToGetHere);