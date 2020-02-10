/* eslint-disable react/no-deprecated */
import React from "react";
import {Alert, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {getDefaultLanguageText, translateText} from "../../translation/translate";
import {CachedImage} from "react-native-img-cache";
import {connect} from "react-redux";
import {DefaultButton} from "../../components/buttons";
import config from "../../../config/config";
import ModalSelector from "../../components/common/modal/ModalSelector";
import {Button} from "../../components/common";
import PropTypes from "prop-types";

class Wayfinder extends React.Component {
	static navigationOptions = ({navigation}) => {
		const {state} = navigation;
		if (state.params && state.params.type === "REPLACE") {
			return {
				title: translateText("Wayfinder").toUpperCase(),
				headerLeft: <TouchableOpacity onPress={() => {
					return navigation.navigate("DrawerOpen");
				}}>
					<CachedImage source={require("../../../assets/icons/menu-icon.png")}
					             style={{width: 20, height: 20, margin: 15}}
					/>
				</TouchableOpacity>
			};
		}
		return {
			title: translateText("Wayfinder").toUpperCase()
		};
	};

	returnData(data) {
		let params = {};

		if (data.type === "beacons") {
			params[this.state.selectionActive] = {
				title: translateText("your_location"),
				type: "beacons",
				your_location: true
			};
		}
		else if (data.type === "parking") {
			params[this.state.selectionActive] = {
				title: translateText("parking_location"),
				parking_location: true,
				id: `${this.props.parkingBeacon.n}_parkingspot`
			};
		}
		else {
			params[this.state.selectionActive] = data;
		}

		this.setState(params);
	}

	constructor(props) {
		super(props);
	}

	state = {
		to: null,
		from: null,
		selectionActive: ""
	};

	componentWillMount() {
		const {params} = this.props.navigation.state;
		if (params) {

			if (params.to) {
				this.setState({
					to: params.to
				});
			}
			if (params.from) {
				this.setState({
					from: params.from
				});
			}
		}
	}

	_renderNavigationButton = () => {
		const locations = [{
			key: "disabled",
			label: translateText("use_elevators")
		}, {
			key: "pedestrian",
			label: translateText("use_escalators")
		}];

		if (!this.state.from || !this.state.to) {
			return (
				<Button
					style={styles.navigateButton}
					onPress={() => {
						if (!this.state.from || !this.state.to) {
							Alert.alert("Warning", "Please select the locations you would like to get directions for.");
						}
					}}
				>
					<Text style={styles.navigateButtonText}>{translateText("Draw route").toUpperCase()}</Text>
				</Button>
			);
		}

		return (
			<ModalSelector
				data={locations}
				cancelText={translateText("Cancel")}
				disabled={!this.state.from || !this.state.to}
				buttonStyle={styles.navigateButton}
				onChange={(option) => {
					if (this.props.internetConnection) {
						this.props.navigation.navigate(
							"MallMap", {
								from: this.state.from,
								to: this.state.to,
								type: option.key
							}
						);
					}
					else {
						Alert.alert("Internet Connection", "Need Internet Connection.");
					}
				}}>
				<Text style={styles.navigateButtonText}>{translateText("Draw route").toUpperCase()}</Text>
			</ModalSelector>
		);
	};

	render() {
		return (
			<View style={styles.container}>
				<View>
					<CachedImage style={{alignSelf: "center", width: "50%"}} resizeMode={"contain"}
					             source={require("../../../assets/images/wayfinder_header.png")}/>
					<View style={{flexDirection: "row", alignItems: "center"}}>
						<CachedImage style={{width: 25, marginBottom: 20}} resizeMode={"contain"}
						             source={require("../../../assets/icons/ic_wayfinder_icons.png")}/>

						<View style={styles.selectRootContainer}>
							<View style={styles.rootChild}>
								<DefaultButton
									style={[styles.selectContainer, {opacity: this.state.from && this.state.from.parking_location ? 0.5 : 1}]}
									titleStyle={styles.selectText}
									title={this.state.from ? getDefaultLanguageText(this.state.from.title) : translateText("choose_starting_point")}
									onPress={() => {
										this.setState({
											selectionActive: "from"
										});

										this.props.navigation.navigate("WayfinderStoreList", {
											returnData: this.returnData.bind(this),
											title: "choose_starting_point",
											selectionActive: "from",
											parking_location: this.state.to && !!this.state.to.parking_location
										});
									}}/>
							</View>
							<View>
								<Text style={styles.defaultText}>*{translateText("location_of_nearest_store")}</Text>
							</View>
							<View style={styles.rootChild}>
								<DefaultButton
									style={[styles.selectContainer, {opacity: this.state.to && this.state.to.parking_location ? 0.5 : 1}]}
									titleStyle={styles.selectText}
									title={this.state.to ? getDefaultLanguageText(this.state.to.title) : translateText("choose_destination")}
									onPress={() => {
										if (this.state.to !== null || !this.state.to) {
											this.setState({
												selectionActive: "to"
											});
											this.props.navigation.navigate("WayfinderStoreList", {
												returnData: this.returnData.bind(this),
												title: "choose_destination",
												selectionActive: "to",
												parking_location: this.state.from && !!this.state.from.parking_location

											});
										}
									}}/>
							</View>
							<View>
								<Text
									style={styles.defaultText}>*{translateText("location_of_desired_store")}</Text>
							</View>
						</View>

						<TouchableOpacity onPress={() => {
							if (this.state.from && !this.state.from.your_location) {
								this.setState({
									from: this.state.to,
									to: this.state.from
								});
							}
						}}>
							<View style={{
								width: 36,
								height: 30,
								marginBottom: 20,
								backgroundColor: config().BASE_SECOND_COLOR,
								alignItems: "center",
								justifyContent: "center"
							}}>
								<CachedImage style={{width: 25, height: 25}} resizeMode={"contain"}
								             source={require("../../../assets/icons/degistir.png")}/>
							</View>
						</TouchableOpacity>
					</View>
					<View style={{
						marginTop: 20, shadowColor: "#000", shadowOpacity: 0.3, shadowOffset: {
							width: 0,
							height: 2
						}
					}}>
						{this._renderNavigationButton()}
					</View>
				</View>
			</View>
		);
	}
}

Wayfinder.propTypes = {
	internetConnection: PropTypes.bool,
	parkingBeacon: PropTypes.object,
	navigation: PropTypes.object
};

const styles = {
	defaultText: {
		fontSize: 15,
		color: config().BASE_SECOND_COLOR
	},
	navigateButtonText: {
		fontSize: 15,
		color: "#fff",
		padding: 10,
		alignSelf: "center"
	},
	navigateButton: {
		backgroundColor: config().BASE_SECOND_COLOR,
		alignItems: "center",
		justifyContent: "center",
		alignSelf: "center",
		width: "70%",
		elevation: 1,
		height: 40
	},
	container: {
		padding: 15,
		justifyContent: "center",
		flex: 1,
		flexDirection: "row",
		backgroundColor: "#fff"
	},
	selectRootContainer: {
		marginLeft: 20,
		marginRight: 20,
		maxWidth: "100%"
	},
	rootChild: {
		marginTop: 15,
		marginBottom: 15,
		borderWidth: StyleSheet.hairlineWidth
	},
	selectContainer: {
		height: 40,
		padding: 8,
		justifyContent: "center",
		alignItems: "flex-start",
		width: "100%"
	},
	selectText: {
		fontSize: 18,
		width: "100%",
		color: "#555"
	}
};

const mapStateToProps = ({main, beacon}) => {
	return {
		internetConnection: main.connection,
		parkingBeacon: beacon.parking
	};
};

const WayfinderRedux = connect(mapStateToProps)(Wayfinder);
export {WayfinderRedux as Wayfinder};
