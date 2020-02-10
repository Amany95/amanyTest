import Gallery from 'react-native-image-gallery';
import React from "react";

class StoreImageGallery extends React.Component {
    static navigationOptions = ({navigation}) => ({
        title: navigation.state.params.title.toUpperCase().toUpperCase(),
    });

    render() {
        return (
            <Gallery
                style={{flex: 1, backgroundColor: 'black'}}
                images={this.props.navigation.state.params.gallery_photos.map((photo) => {
                    return {source: {uri: photo.original}}
                })}
            />
        );
    }
}

export {StoreImageGallery}