import React from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {CachedImage} from "react-native-img-cache";
import {getDefaultLanguageText} from "../../translation/translate";
import {Card} from "../common";

const ListItem = (props) => {

	return (
		<Card style={[styles.rootContainer, {borderTopWidth: props.firstItemSection ? 1 : 0}]} key={props.key}>
			<TouchableOpacity removeClippedSubviews={true} onPress={props.onPress} activeOpacity={0.7}>
				<View style={{flexDirection: "row"}}>
					<View style={{width: 64, height: 64}}>
						<CachedImage source={{uri: props.item.logo}}
						             defaultSource={require("../../../assets/images/placeholder_store_logo.png")}
						             style={styles.logoImage}/>
					</View>
					<View style={styles.container}>
						<View style={styles.textContainer}>
							<Text style={styles.storeText}
							      numberOfLines={1}>{getDefaultLanguageText(props.item.name)}</Text>
							<View style={styles.floorContainer}>
								<CachedImage style={{width: 12, height: 12, alignSelf: "center"}}
								             source={require("../../../assets/icons/store_map_icon.png")}/>
								<Text style={styles.floorText}
								      numberOfLines={1}>{getDefaultLanguageText(props.item.floor_names)}
								</Text>
							</View>
						</View>
						<View style={{alignSelf: "center"}}>
							{props.item.fav ?
								<CachedImage source={require("../../../assets/icons/fav-del.png")}
								             resizeMode={"contain"}
								             style={[styles.favImage]}/> :
								<CachedImage source={require("../../../assets/icons/fav.png")} resizeMode={"contain"}
								             style={[styles.favImage]}/>
							}
						</View>
					</View>
				</View>
			</TouchableOpacity>
		</Card>
	);
};

const styles = {
	rootContainer: {
		backgroundColor: "#fff",
		borderBottomWidth: 1,
		borderColor: "#ccc",
		padding: 10,
		height: 85,
		zIndex: 1
	},
	container: {
		marginLeft: 15,
		flexDirection: "row",
		justifyContent: "space-around",
		flex: 1,
		height: "100%",
		width: "100%"
	},
	storeText: {
		fontSize: 16,
		textAlign: "left"
	},
	floorText: {
		fontSize: 13,
		fontWeight: "400",
		color: "#ccc"
	},
	logoImage: {
		resizeMode: "contain",
		width: 64,
		height: 64,
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: "#000"
	},
	textContainer: {
		flexDirection: "column",
		justifyContent: "center",
		flex: 1
	},
	floorContainer: {
		flexDirection: "row"
	},
	favImage: {
		width: 20,
		height: 20
	}
};

export default ListItem;
