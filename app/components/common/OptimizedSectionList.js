import React from 'react'
import {SectionList} from 'react-native'

export default class OptimizedSectionList extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};

    }

    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    render() {
        return (
            <SectionList
                {...this.props}
                keyExtractor={(item, index) => index.toString()}
                shouldItemUpdate={(props, nextProps) => {
                    // // console.log(props, nextProps);
                    return props.item !== nextProps.item
                }}
                maxToRenderPerBatch={1}
                onEndReachedThreshold={1}
                initialNumToRender={100}
            />
        )
    }
}