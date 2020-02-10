import React, {Component} from "react";
import {Animated, StyleSheet, Text, View,} from 'react-native';
import {Button} from "./button/Button";


class DefaultTabBar extends Component {
    constructor(props, context) {
        super(props, context);
        this.renderTab = this.renderTab.bind(this)
    }


    static defaultProps = {
        activeTextColor: 'navy',
        inactiveTextColor: 'black',
        activeBorderColor: 'navy',
        inactiveBorderColor: 'black',
        backgroundColor: null,
    }

    renderTab(name, page, isTabActive, onPressHandler) {
        const {activeTextColor, inactiveTextColor, textStyle, activeBorderColor, inactiveBorderColor} = this.props;
        const textColor = isTabActive ? activeTextColor : inactiveTextColor;
        const borderColor = isTabActive ? activeBorderColor : inactiveBorderColor;
        const fontWeight = isTabActive ? 'bold' : 'normal';


        return <Button
            style={{flex: 1,}}
            key={name}
            accessible={true}
            accessibilityLabel={name}
            accessibilityTraits='button'
            onPress={() => onPressHandler(page)}
        >
            <View style={[styles.tab, this.props.tabStyle, {borderColor: borderColor}]}>
                <Text style={[{color: textColor, fontWeight,}, textStyle,]}>
                    {name}
                </Text>
            </View>
        </Button>;
    }


    render() {
        const containerWidth = this.props.containerWidth;
        const numberOfTabs = this.props.tabs.length;
        const tabUnderlineStyle = {
            position: 'absolute',
            width: containerWidth / numberOfTabs,
            height: 4,
            backgroundColor: 'navy',
            bottom: 0,
        };

        const left = {
            transform: [
                {
                    translateX: this.props.scrollValue.interpolate({
                        inputRange: [0, 1,],
                        outputRange: [0, containerWidth / numberOfTabs,],
                    })
                }
            ]
        };

        return (
            <View style={[styles.tabs, {backgroundColor: this.props.backgroundColor,}, this.props.style,]}>
                {this.props.tabs.map((name, page) => {
                    const isTabActive = this.props.activeTab === page;
                    const renderTab = this.props.renderTab || this.renderTab;
                    return renderTab(name, page, isTabActive, this.props.goToPage);
                })}
                <Animated.View style={[tabUnderlineStyle, left, this.props.underlineStyle,]}/>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    tab: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabs: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderWidth: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: '#141414',
    },
});

export {DefaultTabBar};