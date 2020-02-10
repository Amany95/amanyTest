import React from "react";
import PropTypes from "prop-types";
import {TextInput, View} from "react-native";
import {CachedImage} from "react-native-img-cache";
import _ from "lodash";

class SearchView extends React.PureComponent {
    static defaultProps = {
        onChange() {
        },
        caseSensitive: false,
        fuzzy: false,
        throttle: 100
    };

    constructor(props, context) {
        super(props, context);
    }

    render() {
        const {style, ...inputProps} = this.props;
        inputProps.type = inputProps.type || "search";
        inputProps.placeholder = inputProps.placeholder || "Search";

        return (
            <View>
                <TextInput
                    underlineColorAndroid='rgba(0,0,0,0)'
                    style={style}
                    onChangeText={(text) => {
                        this.updateSearch(text);
                    }}
                    {...inputProps} // Inherit any props passed to it; e.g., multiline, numberOfLines below
                />
                <CachedImage source={require("../../../assets/icons/search_icon.png")}
                             style={styles.searchImage}/>
            </View>
        )
    }

    updateSearch = (searchTerm) => {
        if (this.props.onChange) {
            this.props.onChange(searchTerm);
        }
    }
}

const styles = {
    searchImage: {
        position: "absolute",
        marginTop: 12,
        width: 16,
        height: 16,
        right: 10
    }
};

SearchView.propTypes = {
    onChange: PropTypes.func,
    caseSensitive: PropTypes.bool,
    sortResults: PropTypes.bool,
    fuzzy: PropTypes.bool,
    throttle: PropTypes.number,
    value: PropTypes.string,
    style: PropTypes.oneOfType([
        PropTypes.instanceOf(Object),
        PropTypes.number
    ])
};

export {SearchView};
