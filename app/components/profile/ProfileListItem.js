import {Text, TouchableOpacity, View} from "react-native";
import React, {Component} from "react";
import {getDefaultLanguageText} from "../../translation/translate";

export class ProfileListItem extends Component {

    render() {
        return (
            <View style={styles.rootContainer}>
                <TouchableOpacity onPress={this.props.onPress}>
                    <View style={styles.container}>
                        <View style={styles.storeText}>
                            <Text numberOfLines={1}>{getDefaultLanguageText(this.props.item.title)}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = {
    rootContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        backgroundColor: '#fff',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        elevation: 1,
        marginTop: 10
    },
    container: {
        margin: 15,
        flexDirection: 'row',
        justifyContent: 'space-around',
        flex: 1
    },
    storeText: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        flex: 1
    }
};