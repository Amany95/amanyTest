import React, {Component} from "react";
import {connect} from "react-redux";
import {StyleSheet, Text, View} from "react-native";
import {translateText} from "../../translation/translate";
import config from "../../../config/config";
import {Button} from "../../components/common";
import PropTypes from "prop-types";

class LocateWithBluetooth extends Component {
	static navigationOptions = () => {
		return {
			title: translateText("LocateWithBluetooth").toUpperCase()
		};
	};

	render() {
		// console.log("this.props.parkingBeacon", this.props.parkingBeacon);

		return (
			<View style={styles.container}>
				<Text style={styles.titleStyle}>
					{!!this.props.parkingBeacon ? `${translateText("locate_result_success")} ${this.props.parkingBeacon.b}` : translateText("locate_scan_below")}
				</Text>

				<Button style={styles.buttonContainer} onPress={() => {
					this.props.navigation.navigate("MallMap", {
						parkingMode: true
					});
				}}>
					<Text style={{color: "#fff", alignSelf: "center"}}>{translateText("locate_btn_scan")}</Text>
				</Button>

				{!!this.props.parkingBeacon && <Button style={styles.buttonContainer} onPress={() => {
					this.props.navigation.navigate("Wayfinder", {
						to: {
							title: translateText("parking_location"),
							id: `${this.props.parkingBeacon.n}_parkingspot`,
							parking_location: true
						}
					});
				}}>
					<Text style={{color: "#fff", alignSelf: "center"}}>{translateText("qr_btn_wayfinding")}</Text>
				</Button>}
			</View>
		);
	}

}

LocateWithBluetooth.propTypes = {
	navigation: PropTypes.object,
	parkingBeacon: PropTypes.oneOfType([
		PropTypes.instanceOf(Object),
		PropTypes.bool
	])
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		backgroundColor: "#F5FCFF"
	},
	buttonContainer: {
		justifyContent: "center",
		backgroundColor: config().BASE_SECOND_COLOR,
		padding: 15,
		width: 200,
		marginTop: 15
	},
	titleStyle: {
		fontSize: 21,
		margin: 40,
		textAlign: "center"
	},
	helpButton: {
		position: "absolute",
		bottom: 25
	}
});

function mapStateToProps({beacon}) {
	return {parkingBeacon: beacon.parking};
}

const LocateWithBluetoothRedux = connect(
	mapStateToProps
)(LocateWithBluetooth);

export {LocateWithBluetoothRedux as LocateWithBluetooth};
