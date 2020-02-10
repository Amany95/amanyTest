import CardSection from "../common/CardSection";
import {Text, TouchableOpacity, View} from "react-native";
import {CachedImage} from "react-native-img-cache";
import React from "react";
import {Card} from '../common'
import {getDefaultLanguageText} from "../../translation/translate";

export const SelectorListItem = (props) => {
    return (
        <Card>
            <Card style={styles.rootContainer} key={props.key}>
                <TouchableOpacity onPress={props.onPress} activeOpacity={0.7}>
                    <CardSection>
                        <View>
                            <CachedImage source={{uri: props.item.image_url}}
                                         style={styles.logoImage}/>
                        </View>
                        <View style={styles.container}>
                            <View style={styles.textContainer}>
                                <Text style={styles.storeText}
                                      numberOfLines={1}>{getDefaultLanguageText(props.item.title)}</Text>
                                <Text style={styles.floorText}
                                      numberOfLines={1}>{props.item.floor_names && getDefaultLanguageText(props.item.floor_names)}
                                </Text>
                            </View>

                        </View>
                    </CardSection>
                </TouchableOpacity>
            </Card>
        </Card>
    )
};

const styles = {
    rootContainer: {
        padding: 15
    },
    container: {
        marginLeft: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1
    },
    storeText: {
        fontSize: 18
    },
    logoImage: {
        resizeMode: 'cover',
        width: 48,
        height: 48
    },
    textContainer: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        flex: 1
    },
    floorText: {
        color: '#555',
        fontSize: 14
    }
};