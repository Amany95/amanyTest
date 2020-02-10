import React from "react";
import {Image, PixelRatio, StyleSheet, View} from "react-native";
import AsyncStorage from "../../utils/AsyncStorage";

import ImagePicker from "react-native-image-picker";
import {translateText} from "../../translation/translate";
import {Button} from "../../components/common";
import {connect} from "react-redux";
import {CachedImage} from "react-native-img-cache";
import config from "../../../config/config";

const options = {
	quality: 1.0,
	maxWidth: 500,
	maxHeight: 500,
	storageOptions: {
		skipBackup: true
	}
};

class ImagePick extends React.Component {
	static navigationOptions = () => {
		return {
			title: translateText("Take Photo/View").toUpperCase()
		};
	};

	state = {
		avatarSource: null
	};

	componentWillMount() {
		AsyncStorage.getItem("parking-image").then((file) => {
			if (file) {
				this.setState({
					avatarSource: JSON.parse(file)
				});
			}

		});
	}

	selectFromCamera = () => {
		ImagePicker.launchCamera(options, (response) => {
			// Same code as in above section!

			this.selectPhotoTapped(response);
		});
	};

	selectFromLibrary = () => {
		ImagePicker.launchImageLibrary(options, (response) => {
			// Same code as in above section!
			this.selectPhotoTapped(response);
		});
	};

	selectPhotoTapped(response) {
		if (response.didCancel) {
		}
		else if (response.error) {
		}
		else if (response.customButton) {
		}
		else {
			let source = {uri: response.uri};

			AsyncStorage.setItem("parking-image", JSON.stringify(source));

			this.setState({
				avatarSource: source
			});
		}
	}

	render() {
		return (
			<View style={styles.container}>
				{this.getImage()}
				<View style={styles.buttonContainer}>
					<Button onPress={() => {
						this.selectFromLibrary();
					}}>
						<CachedImage style={styles.iconStyle} source={require("../../../assets/icons/gallery.png")}/>
					</Button>
					<Button onPress={() => {
						this.selectFromCamera();
					}}>
						<CachedImage style={styles.iconStyle}
						             source={require("../../../assets/icons/photo-camera.png")}/>
					</Button>
				</View>
			</View>
		);
	}

	getImage() {
		if (this.state.avatarSource) {
			return (
				<Image style={[styles.avatar, {width: "100%"}]}
				       source={this.state.avatarSource}/>
			);
		}
		return (
			<Image style={[styles.avatar]}
			       source={require("../../../assets/images/parking_photo.png")}/>
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
		borderColor: "#9B9B9B",
		borderTopWidth: 1 / PixelRatio.get(),
		justifyContent: "space-between",
		backgroundColor: config().BASE_COLOR,
		flexDirection: "row",
		alignItems: "center",
		paddingLeft: 15,
		paddingRight: 15,
		width: "100%",
		height: 50
	},
	iconStyle: {
		resizeMode: "contain",
		width: 24,
		height: 24
	},
	avatar: {
		flex: 1,
		resizeMode: "contain"
	}
});

const mapStateToProps = (state) => {
	return state;
};

const ImagePickRedux = connect(mapStateToProps)(ImagePick);
export {ImagePickRedux as ImagePick};
