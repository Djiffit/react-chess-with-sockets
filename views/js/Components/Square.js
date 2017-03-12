import React, {Component, PropTypes} from 'react';

export default class Square extends Component {

    render() {
        const {black} = this.props;
        var fill = black ? 'lightgrey' : 'white';
        fill = this.props.movable ? 'lightgreen' : fill;
        const empty = this.props.empty ? 'none' : 'inline';
        return (
            <div style={{ backgroundColor: fill,
                width:'100%',
                height: '100%',
                textAlign:'center',
                borderStyle: 'solid', borderColor:'grey', borderWidth:'0.1px',
            }}>
                <span style={{fontSize: '4vw', userSelect:'none', color:fill, display: empty}}>♘</span>
                {this.props.children}
            </div>)
    }
}