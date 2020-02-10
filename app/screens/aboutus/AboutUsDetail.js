import React, {Component} from "react";
import {connect} from "react-redux";
import {getDefaultLanguageText} from "../../translation/translate";
import AutoHeightWebView from "../../components/common/AutoHeightWebView";
import {ScrollView} from "react-native";

class AboutUsDetail extends Component {
	static navigationOptions = ({navigation}) => {
		return {
			title: getDefaultLanguageText(navigation.state.params.title).toUpperCase()
		};
	};

	render() {
		// console.log("this.props.navigation.state.params.aboutus.url", this.props.navigation.state.params.aboutus.url);

		return (
			<ScrollView>
				<AutoHeightWebView
					navigation={this.props.navigation}
					defaultUrl={this.props.navigation.state.params.aboutus.url}
					autoHeight={true}
				/>
			</ScrollView>
		);
	}
}

const styles = {
	container: {flex: 1}
};

const mapStateToProps = (state) => {
	return state;
};

const AboutUsDetailRedux = connect(mapStateToProps)(AboutUsDetail);
export {AboutUsDetailRedux as AboutUsDetail};
