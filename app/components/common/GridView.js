import React, {Component} from 'react';
import {View, ListView, Dimensions} from 'react-native';

function chunkArray(array, size) {
    return array.reduce((acc, val) => {
        if (acc.length === 0) acc.push([]);
        const last = acc[acc.length - 1];
        if (last.length < size) {
            last.push(val);
        } else {
            acc.push([val]);
        }
        return acc;
    }, []);
}

class GridView extends Component {
    constructor(props) {
        super(props);
        this.renderRow = this.renderRow.bind(this);
        this.onLayout = this.onLayout.bind(this);
        this.getDimensions = this.getDimensions.bind(this);
        this.state = this.getDimensions();
    }

    onLayout(e) {
        if (!this.props.staticWidth) {
            const {width} = e.nativeEvent.layout || {};

            this.setState({
                ...this.getDimensions(width),
            });
        }

    }

    getDimensions(lvWidth) {
        const {itemWidth, spacing, fixed, staticWidth, itemsPerRow} = this.props;
        const totalWidth = lvWidth || staticWidth || Dimensions.get('window').width;
        const availableWidth = totalWidth - spacing; // One spacing extra
        const containerWidth = availableWidth / itemsPerRow;

        return {
            itemWidth,
            spacing,
            itemsPerRow,
            containerWidth,
            fixed,
        };
    }

    renderRow(data, sectionId, rowId) {
        const {itemWidth, spacing, containerWidth, fixed} = this.state;

        const rowStyle = {
            flexDirection: 'row',
            paddingLeft: spacing,
            paddingBottom: spacing,
        };
        const columnStyle = {
            flexDirection: 'column',
            justifyContent: 'center',
            width: containerWidth,
            paddingRight: spacing,
        };
        let itemStyle = {};
        if (fixed) {
            itemStyle = {
                width: itemWidth,
                alignSelf: 'center',
            };
        }

        return (
            <View style={rowStyle}>
                {(data || []).map((item, i) => (
                    <View key={`${rowId}_${i}`} style={columnStyle}>
                        <View style={itemStyle}>
                            {this.props.renderItem(item, i)}
                        </View>
                    </View>
                ))}
            </View>
        );
    }

    render() {
        const {items, style, spacing, ...props} = this.props;
        const {itemsPerRow} = this.state;

        const rows = chunkArray(items, itemsPerRow);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        return (
            <ListView
                style={[{paddingTop: spacing}, style]}
                onLayout={this.onLayout}
                dataSource={ds.cloneWithRows(rows)}
                renderRow={this.renderRow}
                {...props}
            />
        );
    }
}

GridView.defaultProps = {
    fixed: false,
    itemWidth: 130,
    spacing: 2,
    style: {},
    staticWidth: undefined
};

export  {GridView};