import React from 'react';
import {Animated, Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import SlidingUpPanel from "../common/SlidingUpPanel";
import {CachedImage} from "react-native-img-cache";
import {getDefaultLanguageText} from "../../translation/translate";
import config from "../../../config/config";

const height = Dimensions.get('window').height; // Default its must change

export class SlideUpView extends React.Component {
    constructor(props, context) {
        super(props, context);
        this._navigateSelector = this._navigateSelector.bind(this);
    }


    static defaultProps = {
        draggableRange: {
            top: height / 2,
            bottom: 200
        },
        directionButtonDismiss: false,
    };
    state = {
        isShown: false,
        locationOpened: null
    };

    _draggedValue = new Animated.Value(0);

    componentWillReceiveProps(nextProps) {
        this.setState({
            locationOpened: nextProps.locationOpened
        })
    }

    _navigateSelector = () => {
        let to = this.state.locationOpened;
        to['title'] = this.state.locationOpened.rawData.name;

        this.props.navigation.navigate('Wayfinder', {
                to: to,
            },
        )
    };

    locationOpened = () => {
        if (this.state.locationOpened) {
            const {image_url, rawData} = this.state.locationOpened;

            const {top, bottom} = this.props.draggableRange;
            const draggedValue = this._draggedValue.interpolate({
                inputRange: [-(top + bottom) / 2, -bottom],
                outputRange: [1, 1.5],
                extrapolate: 'clamp'
            });

            const transform = [{scale: draggedValue}];

            const marginValue = this._draggedValue.interpolate({
                inputRange: [-(top + bottom) / 2, -bottom],
                outputRange: [0, 50],
                extrapolate: 'clamp'
            });

            const fontSize = this._draggedValue.interpolate({
                inputRange: [-(top + bottom) / 2, -bottom],
                outputRange: [15, 21],
                extrapolate: 'clamp'
            });

            return (
                <View style={styles.locationSelectContainer}>
                    <View style={{flexDirection: 'row', alignItems: 'center', flex: 1, margin: 20}}>
                        <Animated.View
                            style={[{
                                width: 48,
                                height: 48,
                                padding: 5,
                                borderWidth: StyleSheet.hairlineWidth,
                                alignSelf: 'flex-start',
                                margin: 5
                            }, {transform}]}>
                            <CachedImage source={{uri: image_url}}
                                         style={{
                                             width: '100%',
                                             height: '100%',
                                         }}
                            />
                        </Animated.View>

                        <Animated.Text style={[styles.title, {
                            marginLeft: marginValue,
                            fontSize: fontSize
                        }]}>{getDefaultLanguageText(rawData.name)}</Animated.Text>

                    </View>

                    <View style={{width: 50, flexDirection: 'column'}}>
                        <TouchableOpacity style={styles.directionButton} onPress={() => {
                            this.setState({
                                locationOpened: null
                            });
                            this.props.navigationBarOnChange()
                        }}>
                            <CachedImage
                                style={styles.closeImage}
                                source={require('../../../assets/icons/map_detail_close.png')}/>

                        </TouchableOpacity>
                        {!this.props.directionButtonDismiss &&
                        <TouchableOpacity style={styles.directionButton} onPress={() => {
                            this._navigateSelector();
                        }}>
                            <CachedImage
                                style={styles.directionImage}
                                source={require('../../../assets/icons/map_detail_direction.png')}/>
                        </TouchableOpacity>
                        }
                    </View>
                </View>
            )
        }
    };

    render() {
        return (
            <SlidingUpPanel
                visible={this.state.locationOpened !== null}
                showBackdrop={false}
                contentStyle={{backgroundColor: '#fff'}}
                draggableRange={this.props.draggableRange}
                onDrag={(v) => this._draggedValue.setValue(v)}>
                {this.locationOpened()}
            </SlidingUpPanel>
        );
    }
}

const
    styles = StyleSheet.create({
            title: {
                fontWeight: '600',
                fontSize: 15,
                color: config().BASE_COLOR,
                marginBottom: 5,
                maxWidth: '70%'
            },
            directionButton: {
                height: 40,
                width: 40,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 8,
                marginRight: 10
            },
            closeImage: {
                height: 16,
                width: 16,
                resizeMode: 'contain'
            },
            directionImage: {
                height: 36,
                width: 36,
                resizeMode: 'contain'
            },
            locationSelectContainer: {
                backgroundColor: '#ffffff',
                flexDirection: 'row',
                alignItems: 'flex-start',
                flex: 1,
                shadowRadius: 8,
                shadowOpacity: 0.3,
                elevation: 2,
                borderTopWidth: 1,
            },

        }
    );