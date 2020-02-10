import React from "react";
import {Alert, StyleSheet, Text, View} from "react-native";
import {translateText} from "../../translation/translate";
import {Button} from "../../components/common";
import {connect} from "react-redux";
import config from "../../../config/config";
import {BeaconParkingSpot} from "../../actions/Beacon";
import AsyncStorage from "../../utils/AsyncStorage";
import PropTypes from "prop-types";

class QrCode extends React.Component {
	static navigationOptions = () => {
		return {
			title: translateText("QrCode").toUpperCase()
		};
	};

	qrCodeCallback = (qrCode) => {
		if (qrCode) {
			AsyncStorage.setItem("qr_code", JSON.stringify(qrCode));
			AsyncStorage.removeItem("parking_spot");

			this.props.BeaconParkingSpot(qrCode);
		}
		else {
			Alert.alert("Error", "Not a valid QR code");
		}
	};

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.titleStyle}>
					{!!this.props.parkingBeacon ? `${translateText("qr_result_success")} ${this.props.parkingBeacon.b}` : translateText("qr_scan_below")
					}</Text>

				<Button style={styles.buttonContainer} onPress={() => {
					this.props.navigation.navigate("QrCodeScanner", {
						qrCodeCallback: this.qrCodeCallback
					});
				}}>
					<Text style={styles.buttonText}>{translateText("qr_btn_scan")}</Text>
				</Button>

				{!!this.props.parkingBeacon && <Button style={styles.buttonContainer} onPress={() => {
					// TODO navigate to wayfinder
					this.props.navigation.navigate("Wayfinder", {
						to: {
							title: "Parking Location",
							id: `${this.props.parkingBeacon.n}_parkingspot`,
							parking_location: true
						}
					});
				}}>
					<Text style={styles.buttonText}>{translateText("qr_btn_wayfinding")}</Text>
				</Button>}

				<Button style={styles.helpButton} onPress={() => {
					this.props.navigation.navigate("QrCodeHelpPage");
				}}>
					<Text>{translateText("qr_btn_how")}</Text>
				</Button>
			</View>
		);
	}

}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		backgroundColor: "#F5FCFF"
	},
	buttonContainer: {
		justifyContent: "center",
		backgroundColor: config().BASE_SECOND_COLOR,
		width: 200,
		marginTop: 15
	},
	buttonText: {
		color: "#fff",
		alignSelf: "center",
		margin: 15
	},
	titleStyle: {
		fontSize: 21,
		margin: 40,
		textAlign: "center"
	},
	helpButton: {
		position: "absolute",
		padding: 25,
		bottom: 0
	}
});

QrCode.propTypes = {
	BeaconParkingSpot: PropTypes.func,
	navigation: PropTypes.object,
	parkingBeacon: PropTypes.oneOfType([
		PropTypes.instanceOf(Object),
		PropTypes.bool
	])
};

const mapStateToProps = ({beacon}) => {
	return {parkingBeacon: beacon.parking};
};

const QrCodeRedux = connect(mapStateToProps, {
	BeaconParkingSpot

})(QrCode);
export {QrCodeRedux as QrCode};
