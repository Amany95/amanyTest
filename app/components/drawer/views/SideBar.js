import React from "react";
import {Dimensions, Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {connect} from "react-redux";
import {NavigationActions} from "react-navigation";
import {CachedImage} from "react-native-img-cache";
import PropTypes from "prop-types";

import {translateText} from "../../../translation/translate";
import routeConfig from "../../../navigators/routeConfig";
import Normalize from "../../../utils/Normalize";
import {setLocale} from "../../../actions/i18n";

const {width, height} = Dimensions.get("window");

class SideBar extends React.Component {

	_getRoutes = () => {
		return routeConfig().ROUTE_PAGES.map((item, i) => {
			if (item.drawer_component) {
				return (
					<TouchableOpacity key={i} style={styles.routeItemButton} onPress={() => {
						this.props.navigation.navigate(item.routeName, {
							type: "REPLACE"
						});
					}
					}>
						<View style={styles.routeItemContainer}>
							<CachedImage source={item.icon} resizeMode={"contain"} style={{height: 30, width: 30}}/>
							<Text
								style={styles.routeItemStyle}>{translateText(item.name).toUpperCase()}</Text>
						</View>
					</TouchableOpacity>
				);
			}
		});
	};

	render() {
		return (
			<View style={styles.container}>
				<Image
					style={styles.backgroundImage}
					source={require("../../../../assets/images/menu_background.png")}
				/>
				<View style={styles.menu_lang}>
					<Text style={styles.menu_lang_text}
					      onPress={() => {
						      this.props.setLocale(this.props.currentLocale === "en" ? "ar" : "en");
						      this.props.navigation.dispatch(
							      NavigationActions.reset({
								      index: 0,
								      actions: [NavigationActions.navigate({routeName: "Home"})]
							      })
						      );

					      }}
					>{translateText("English")}</Text>
				</View>
				<View style={styles.routeContainer}>
					<ScrollView>
						{this._getRoutes()}
					</ScrollView>
				</View>
			</View>
		);
	}

}

const styles = {
	backgroundImage: {
		backgroundColor: "#ccc",
		flex: 1,
		resizeMode: "cover",
		position: "absolute",
		width: "100%",
		height: "100%",
		justifyContent: "center"
	},
	container: {
		flex: 1,
		height: height,
		width: width
	},
	routeContainer: {
		flex: 1,
		marginLeft: 15,
		marginBottom: 15
	},
	iconContainer: {
		marginRight: 10,
		justifyContent: "center",
		alignItems: "center"
	},
	routeItemStyle: {
		fontSize: Normalize(16),
		marginLeft: 8,
		color: "#fff"
	},
	routeItemContainer: {
		flexDirection: "row",
		alignItems: "center"
	},
	routeItemButton: {
		marginTop: 8
	},
	menu_lang: {
		height: Normalize(70),
		justifyContent: "flex-end",
		alignItems: "flex-end",
		width: "65%"
	},
	menu_lang_text: {
		fontSize: 18,
		color: "#fff",
		padding: 2,
		paddingRight: 6,
		marginBottom: 5
	}
};

SideBar.propTypes = {
	navigation: PropTypes.instanceOf(Object),
	setLocale: PropTypes.func,
	currentLocale: PropTypes.string
};

const mapStateToProps = ({i18n}) => {
	return {currentLocale: i18n.locale};
};

export default connect(mapStateToProps, {setLocale})(SideBar);
