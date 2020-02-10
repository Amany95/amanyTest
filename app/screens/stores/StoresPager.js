import React from "react";
import {StyleSheet, TouchableOpacity, View} from "react-native";
import {connect} from "react-redux";
import StoreListScreen from "./StoreListScreen";
import CategoryListScreen from "./CategoryListScreen";
import FloorListScreen from "./FloorListScreen";
import {CachedImage} from "react-native-img-cache";
import ScrollableTabView from "react-native-scrollable-tab-view";
import {DefaultTabBar} from "../../components/common/DefaultTabBar";
import {translateText} from "../../translation/translate";
import config from "../../../config/config";
import {SearchView} from "../../components/common";
import PropTypes from "prop-types";

class StoresPager extends React.Component {
	static navigationOptions = ({navigation}) => {
		const {state} = navigation;
		if (state.params && state.params.type === "REPLACE") {
			return {
				title: translateText("Directory").toUpperCase(),
				headerLeft: <TouchableOpacity onPress={() => {
					navigation.navigate("DrawerOpen")
				}}>
					<CachedImage source={require("../../../assets/icons/menu-icon.png")}
					             style={{width: 20, height: 20, margin: 15}}
					/>
				</TouchableOpacity>
			};
		}
		return {
			title: translateText("Directory").toUpperCase()
		};
	};

	constructor(props, context) {
		super(props, context);
		this.state = {
			searchTerm: ""
		};
	}

	render() {
		return (
			<View style={{flex: 1, backgroundColor: "#fff"}}>
				<SearchView
					onChange={(searchTerm) => {
						this.setState({searchTerm});
					}}
					value={this.state.searchTerm}
					style={styles.searchInput}
					placeholder={translateText("Search")}
					placeholderTextColor={"#000"}
				/>
				<ScrollableTabView
					scrollWithoutAnimation={true}
					onChangeTab={() => {
						this.setState({
							searchTerm: ""
						});
					}}
					renderTabBar={() => {
						return (
							<DefaultTabBar
								underlineStyle={styles.underlineStyle}
								textStyle={styles.labelStyle}
								style={styles.tab}
								tabStyle={styles.tabBar}
								activeTextColor={config().BASE_SECOND_COLOR}
								activeBorderColor={config().BASE_SECOND_COLOR}
								inactiveBorderColor='#ccc'
								inactiveTextColor='#ccc'
							/>
						);
					}
					}>
					<StoreListScreen key='atoz'
					            tabLabel={translateText("a_z")}
					            navigation={this.props.navigation}
					            searchTerm={this.state.searchTerm}
					/>
					<CategoryListScreen key='categories'
					             tabLabel={translateText("Categories")}
					             navigation={this.props.navigation}
					             searchTerm={this.state.searchTerm}
					/>
					<FloorListScreen key='floor'
					            tabLabel={translateText("Floors")}
					            navigation={this.props.navigation}
					            searchTerm={this.state.searchTerm}
					/>
				</ScrollableTabView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	searchInput: {
		padding: 10,
		borderColor: "#999",
		borderBottomWidth: 1,
		fontWeight: "bold",
		fontSize: 15,
		height: 40
	},
	container: {
		flex: 1,
		marginTop: 15
	},
	rootContainer: {
		flex: 1
	},
	tabBar: {
		backgroundColor: "transparent",
		borderWidth: StyleSheet.hairlineWidth,
		height: 40
	},
	indicator: {
		backgroundColor: "transparent"
	},
	labelStyle: {
		fontSize: 15
	},
	underlineStyle: {
		backgroundColor: "transparent"
	},
	tab: {
		borderWidth: 0,
		margin: 8,
		height: "auto"
	}
});

const mapStateToProps = (state) => {
	return state;
};

StoresPager.propTypes = {
	navigation: PropTypes.instanceOf(Object)
};

const storesPagerRedux = connect(mapStateToProps)(StoresPager);
export {storesPagerRedux as storesPager};
