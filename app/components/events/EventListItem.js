import React from "react";
import {Text, View, Dimensions} from "react-native";
import {CachedImage} from "react-native-img-cache";
import {Button} from "../common";
import {getDefaultLanguageText} from "../../translation/translate";

const {width} = Dimensions.get("window");

const EventListItem = ({event, onPress}) => {
	return (
		<View style={styles.cardContainer}>
			<Button onPress={onPress}>
				<View>
					<CachedImage style={styles.imageStyle} source={{uri: event.image}}/>
					<View style={styles.textContainer}>
						<Text numberOfLines={1} style={styles.titleStyle}>{getDefaultLanguageText(event.title)}</Text>
					</View>

				</View>
			</Button>
		</View>
	);
};

const styles = {
	cardContainer: {
		backgroundColor: "#fff",
		margin: 5
	},
	titleStyle: {
		textAlign: "center",
		fontSize: 17,
		color: "#000"
	},
	textContainer: {
		padding: 15,
		justifyContent: "center"
	},
	imageStyle: {
        width: width / 2 - 14,
        height: (width / 2 - 14) / 1.78,
		resizeMode: "cover"
	}
};

export {EventListItem};


