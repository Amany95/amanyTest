import {PixelRatio, Platform} from "react-native";

/**
 * normalize the components measures...
 */

export default (size) => {
	if (Platform.OS === "ios") {
		return Math.round(PixelRatio.roundToNearestPixel(size));
	}
	else {
		return Math.round(PixelRatio.roundToNearestPixel(size)) - 2;
	}
};
