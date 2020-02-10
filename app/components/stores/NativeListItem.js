import React from "react";
import {Text, View} from "react-native";
import PropTypes from "prop-types";
import ListItem from "../stores/ListItem";
import config from "../../../config/config";

class Item extends React.PureComponent {
	styles = {
		storeLetter: {
			color: config().BASE_SECOND_COLOR,
			fontWeight: "600",
			fontSize: 16,
			height: 25
		},
		rootContainer: {
			padding: 5,
			paddingTop: 4,
			backgroundColor: "#fff",
			borderColor: "#ccc",
			borderBottomWidth: 1
		}
	};

	render() {
		const {item, onPress} = this.props;
		const {title, data} = item;

		return (
			<View>
				<View style={this.styles.rootContainer}>
					<View style={this.styles.container}>
						<Text style={this.styles.storeLetter}>{title}</Text>
					</View>
				</View>
				{data.map((object) => {
					return (
						<ListItem
							item={object}
							onPress={() => {
								onPress(object);
							}}
						/>
					);
				})}
			</View>
		);
	}
}

Item.propTypes = {
	onPress: PropTypes.func,
	item: PropTypes.instanceOf(Object)
};

export default Item;
