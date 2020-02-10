"use strict";

import React, {Component} from "react";
import {Dimensions, NavigatorIOS, StyleSheet} from "react-native";
import PropTypes from "prop-types";
import QRCodeScanner from "react-native-qrcode-scanner";
import {connect} from "react-redux";
import _ from "lodash";
import {translateText} from "../../translation/translate";

class QrCodeScanner extends Component {
	static navigationOptions = () => {
		return {
			title: translateText("qr_btn_scan").toUpperCase()
		};
	};

	onSuccess = (e) => {
		const parking_spot = _.find(this.props.parking_spots, {"n": e.data});
		const {qrCodeCallback} = this.props.navigation.state.params;

		// console.log("parking_spot", parking_spot);

		qrCodeCallback(parking_spot);
		this.props.navigation.goBack();
	};

	render() {
		return (
			<NavigatorIOS
				initialRoute={{
					component: QRCodeScanner,
					title: "Scan Code",
					navigationBarHidden: true,
					passProps: {
						onRead: this.onSuccess,
						cameraStyle: styles.cameraContainer,
						topViewStyle: styles.zeroContainer,
						bottomViewStyle: styles.zeroContainer
					}
				}}
				showMarker={true}
				style={{flex: 1}}
			/>
		);
	}
}

const styles = StyleSheet.create({
	zeroContainer: {
		height: 0,
		flex: 0
	},

	cameraContainer: {
		height: Dimensions.get("window").height
	}
});

const mapStateToParams = ({main}) => {

	return {parking_spots: main.payload.parking_spots};
};

QrCodeScanner.propTypes = {
	parking_spots: PropTypes.instanceOf(Array),
	navigation: PropTypes.instanceOf(Object),
	BeaconParkingSpot: PropTypes.func
};

const QrCodeScannerRedux = connect(mapStateToParams)(QrCodeScanner);
export {QrCodeScannerRedux as QrCodeScanner};
