import React, {Component} from "react";
import {Text, TouchableOpacity, View} from "react-native";
import {connect} from "react-redux";
import {getDefaultLanguageText, translateText} from "../../translation/translate";
import {CachedImage} from "react-native-img-cache";
import PropTypes from "prop-types";

class AboutUs extends Component {
	static navigationOptions = ({navigation}) => {
		const {state} = navigation;
		if (state.params && state.params.type === "REPLACE") {
			return {
				title: translateText("AboutUs").toUpperCase(),
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
			title: translateText("AboutUs").toUpperCase()
		};
	};

	render() {

		return (
			<View style={styles.container}>
				{this.props.mall.about_us_items.map((item, index) => {
					return (
						<TouchableOpacity key={index} style={styles.buttonStyle} onPress={() => {
							this.props.navigation.navigate("AboutUsDetail", {
								aboutus: item,
								title: item.title
							});
						}}>
							<Text style={styles.textStyle}>{getDefaultLanguageText(item.title)}</Text>
						</TouchableOpacity>
					);
				})}
			</View>

		);
	}
}

const styles = {
	container: {
		flex: 1,
		backgroundColor: "#efefef"
	},
	textStyle: {
		fontSize: 18
	},
	buttonStyle: {
		padding: 15,
		backgroundColor: "#fff",
		borderBottomWidth: 1,
		borderColor: "#efefef"
	}
};

const mapStateToProps = ({main}) => {
	const {payload} = main;
	return {mall: payload.mall};
};

AboutUs.propTypes = {
	mall: PropTypes.object,
	navigation: PropTypes.object
};

const AboutUsRedux = connect(mapStateToProps)(AboutUs);

export {AboutUsRedux as AboutUs};
