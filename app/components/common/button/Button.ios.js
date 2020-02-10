import {TouchableOpacity, View} from "react-native";
import React from "react";

const Button = ({children, onPress, style}) => {
	return (
		<View style={style}>
			<TouchableOpacity
				style={styles.buttonStyle}
				activeOpacity={0.7}
				onPress={onPress}
			>
				{children}
			</TouchableOpacity>
		</View>
	);
};

const styles = {
	buttonStyle: {
		width: "100%"
	}
};

export {Button};
