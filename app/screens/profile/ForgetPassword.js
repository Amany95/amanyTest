import React from "react";
import {connect} from "react-redux";
import {forgetPassword} from "../../actions/Profile";
import {View} from "react-native";
import {Input} from "../../components/common";
import {translateText} from "../../translation/translate";
import {BorderlessButton} from "../../components/buttons";
import config from "../../../config/config";
import PropTypes from "prop-types";

class ForgetPassword extends React.Component {
	static navigationOptions = () => ({
			title: translateText("ForgotPassword").toUpperCase(),
			headerRight: null
		}
	);

	state = {
		email: ""
	};

	fieldChanged = (text) => {
		this.setState(text);
	};

	render() {
		return (
			<View style={styles.container}>
				<View style={{flex: 0.7}}>
					<View style={{marginTop: 15}}>
						<Input placeholder={translateText("E-Mail")}
						       value={this.state.email}
						       style={styles.defaultInputStyle}
						       keyboardType={"email-address"}
						       onChangeText={(email) => {
							       this.fieldChanged({email});
						       }}/>
					</View>
					<View style={{marginTop: 15}}>
						<BorderlessButton title={translateText("SEND")} style={styles.defaultButtonStyle}
						                  onPress={() => {
							                  this.props.forgetPassword(this.state.email);
						                  }}
						/>
					</View>
				</View>
			</View>
		);
	}
}

const styles = {
	cardContainer: {
		marginTop: 15,
		alignItems: "center"
	},
	defaultInputStyle: {
		backgroundColor: "#fff",
		borderColor: "#555",
		width: "100%",
		height: 40,
		borderWidth: 1,
		padding: 8,
		justifyContent: "center"
	},
	backgroundImage: {
		backgroundColor: "#ccc",
		resizeMode: "cover",
		position: "absolute",
		width: "100%",
		height: "100%",
		justifyContent: "center"
	},
	defaultButtonStyle: {
		width: "100%",
		height: 40,
		backgroundColor: config().BASE_SECOND_COLOR
	},
	buttonText: {
		color: "#fff",
		fontSize: 18
	},
	container: {
		flex: 1,
		justifyContent: "center",
		flexDirection: "row"
	}
};

const mapStateToProps = ({auth}) => {
	const {email, password, error, loading} = auth;
	return {email, password, error, loading};
};

ForgetPassword.propTypes = {
	forgetPassword: PropTypes.func
};

const ForgetPasswordRedux = connect(mapStateToProps, {forgetPassword})(ForgetPassword);

export {ForgetPasswordRedux as ForgetPassword};