import React, {Component} from "react";
import {Text, TouchableOpacity, View} from "react-native";
import {CachedImage} from "react-native-img-cache";
import PropTypes from "prop-types";
import {translateText} from "../../translation/translate";
import {Button} from "../../components/common";
import {connect} from "react-redux";

class Parking extends Component {
	static navigationOptions = ({navigation}) => {
		const {state} = navigation;
		if (state.params && state.params.type === "REPLACE") {
			return {
				title: translateText("Parking").toUpperCase(),
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
			title: translateText("Parking").toUpperCase()
		};
	};

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.buttonGroup}>
					<Button style={styles.button} onPress={() => {
						this.props.navigation.navigate("PictureView");
					}}>
						<CachedImage source={require("../../../assets/images/parking_photo.png")}
						             style={styles.image}/>
						<Text style={styles.titleStyle}>{translateText("Take Photo/View")}</Text>
					</Button>
					<Button style={styles.button} onPress={() => {
						this.props.navigation.navigate("VoiceRecord");
					}}>
						<CachedImage source={require("../../../assets/images/parking_record.png")}
						             style={styles.image}/>
						<Text style={styles.titleStyle}>{translateText("Record/Listen")}</Text>
					</Button>
				</View>
				<View style={styles.buttonGroup}>
					<Button style={styles.button} onPress={() => {
						this.props.navigation.navigate("QrCode");
					}}>
						<CachedImage source={require("../../../assets/images/qr_code_image.png")}
						             style={styles.image}/>
						<Text style={styles.titleStyle}>{translateText("QrCode")}</Text>
					</Button>
					<Button style={[styles.button]} onPress={() => {
						this.props.navigation.navigate("LocateWithBluetooth");
					}}>
						<CachedImage source={require("../../../assets/images/parking_ble_location.png")}
						             style={styles.image}/>
						<Text style={styles.titleStyle}>{translateText("LocateWithBluetooth")}</Text>
					</Button>
				</View>
			</View>
		);
	}
}

const styles = {
	container: {
		flex: 1
	},
	buttonGroup: {
		flexDirection: "row",
		height: 200,
		alignItems: "center",
		borderTopWidth: 1,
		borderColor: "#d5d5d5",
		marginLeft: 30,
		marginRight: 30
	},
	button: {
		alignItems: "center",
		justifyContent: "center",
		flex: 1
	},
	image: {
		alignSelf: "center",
		marginBottom: 15,
		height: 80,
		width: 80,
		resizeMode: "contain"
	},
	titleStyle: {
		fontSize: 14,
		color: "#000",
		alignSelf: "center"
	}
};

Parking.propTypes = {
	navigation: PropTypes.instanceOf(Object)
};

const mapStateToProps = (state) => {
	return state;
};

const ParkingRedux = connect(mapStateToProps)(Parking);
export {ParkingRedux as Parking};
