import React from "react";
import {TouchableOpacity} from "react-native";
import {translateText} from "../translation/translate";
import {connect} from "react-redux";
import {CachedImage} from "react-native-img-cache";
import {Browser} from "./Browser";
import PropTypes from "prop-types";

class TenantPlatform extends React.Component {
	static navigationOptions = ({navigation}) => {
		return {
			title: translateText("TenantPlatform").toUpperCase(),
			headerLeft: <TouchableOpacity onPress={() => {
				navigation.navigate("DrawerOpen");
			}}>
				<CachedImage source={require("../../assets/icons/menu-icon.png")}
				             style={{width: 20, height: 20, margin: 15}}
				/>
			</TouchableOpacity>
		};
	};

	render() {
		const navigation = {
			...this.props.navigation, state: {
				params: {
					uri: this.props.mall["insiders_url"]
				}
			}
		};

		return (
			<Browser navigation={navigation}/>
		);
	}
}

const mapStateToProps = (state) => {
	const {payload} = state.main;
	if (payload !== null) {
		return {
			mall: payload.mall
		};
	}
	return {mall: null};
};

TenantPlatform.propTypes = {
	navigation: PropTypes.object,
	mall: PropTypes.object
};

const TenantPlatformRedux = connect(mapStateToProps)(TenantPlatform);
export {TenantPlatformRedux as TenantPlatform};