import React from 'react';

export default class Title extends React.Component {

    render() {
        const player = this.props.color === 'black' === this.props.black ? 'Your turn' : 'Other player\'s turn';
        const color = this.props.black ? 'black' : 'red';
        return (
            <div style = {{ display: 'flex',
                justifyContent: 'center',
                paddingTop:'15px'
            }}>
                <h3><b style={{ color: color}}>{player}</b></h3>
            </div>
        )
    }
}