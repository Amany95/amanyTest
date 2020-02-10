import {Platform, TouchableNativeFeedback, View} from "react-native";
import React from "react";
import config from "../../../../config/config";

const Button = ({children, onPress, color, style}) => {
	return (
		<View style={style}>
			<TouchableNativeFeedback
				onPress={onPress}
				background={Platform["Version"] >= 21 ? TouchableNativeFeedback.Ripple(color || config().DefaultRippleColor, true) : TouchableNativeFeedback.SelectableBackground()}
				useForeground={false}
				borderless={true}
			>
				<View style={styles.buttonStyle}>
					{children}
				</View>
			</TouchableNativeFeedback>
		</View>
	);
};

const styles = {
	buttonStyle: {
		width: "100%"
	}
};

export {Button};
