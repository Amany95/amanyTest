import React from 'react';
import {StyleSheet, Text, View,} from 'react-native';
import {translateText} from "../../translation/translate";
import {connect} from "react-redux";

class QrCodeHelpPage extends React.Component {
    static navigationOptions = () => {
        return {
            title: translateText('qr_btn_how').toUpperCase(),
        };
    };

    state = {
        avatarSource: null,
    };

    render() {
        return (
            <View style={styles.container}>
                <Text
                    style={[styles.titleStyle, {textAlign: this.props.currentLocale === 'ar' ? 'right' : 'left'}]}>{translateText('qr_btn_how_explanation')}</Text>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    titleStyle: {
        fontSize: 16,
        margin: 15,
    },
});

const mapStateToProps = ({main, i18n}) => {
    return {currentLocale: i18n.locale}
};

const QrCodeHelpPageRedux = connect(mapStateToProps)(QrCodeHelpPage);
export {QrCodeHelpPageRedux as QrCodeHelpPage};