"use strict";
import React, {Component} from "react";
import QRCodeScanner from "react-native-qrcode-scanner";
import {connect} from "react-redux";
import _ from "lodash";
import PropTypes from "prop-types";
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
		qrCodeCallback(parking_spot);
		this.props.navigation.goBack();
	};

	render() {
		return (
			<QRCodeScanner
				onRead={this.onSuccess.bind(this)}
				style={{flex: 1}}
				checkAndroid6Permissions={true}
				showMarker={true}
			/>
		);
	}
}

const mapStateToParams = ({main}) => {

	return {parking_spots: main.payload.parking_spots};
};

QrCodeScanner.propTypes = {
	parking_spots: PropTypes.instanceOf(Array),
	navigation: PropTypes.instanceOf(Object)
};

const QrCodeScannerRedux = connect(mapStateToParams)(QrCodeScanner);
export {QrCodeScannerRedux as QrCodeScanner};
