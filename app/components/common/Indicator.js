import React from "react";
import {ActivityIndicator, View} from "react-native";
import PropTypes from "prop-types";

export const Indicator = ({color = "#222"}) => {

	return (
		<View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
			<ActivityIndicator size='small' color={color}/>
		</View>
	);
};

Indicator.propTypes = {
	color: PropTypes.string
};
