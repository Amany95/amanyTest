import React from "react";
import {translateText} from "../../translation/translate";
import {connect} from "react-redux";
import {CachedImage} from "react-native-img-cache";
import {View} from "react-native";


class QuIdentity extends React.Component {
    static navigationOptions = () => ({
            title: translateText('MyQrIdentity').toUpperCase(),
            headerRight: null
        }
    );

    render() {
        return (
            <View>
                <CachedImage
                    style={{height: 200, width: 200, alignSelf: 'center'}}
                    resizeMode={'contain'}
                    source={{uri: this.props.user.qr_picture}}
                />
            </View>
        );
    }
}

const mapStateToProps = ({auth}) => {
    return auth
};

const QuIdentityRedux = connect(mapStateToProps)(QuIdentity);

export {QuIdentityRedux as QrIdentity};
