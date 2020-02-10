import React from 'react'
import {FlatList,} from 'react-native'
import FlatListItem from './FlatListItem'

export default class OptimizedFlatList extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {};
        this.rowRefs = []
    }

    _addRowRefs(ref, data) {
        this.rowRefs[data.index] = {
            ref: ref,
            item: data.item,
            index: data.index,
        }
    }

    
    _renderItem(data) {
        const view = this.props.renderItem(data)
        return (
            <FlatListItem
                ref={myItem => this._addRowRefs(myItem, data)}
                viewComponent={view}
                data={data}
            />
        )
    }

    render() {
        return (
            <FlatList
                {...this.props}
                renderItem={data => this._renderItem(data)}
                onEndReachedThreshold={1200}
                removeClippedSubviews={true}
            />
        )
    }
}