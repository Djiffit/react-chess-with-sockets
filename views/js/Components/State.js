import React from 'react';

export default class State extends React.Component {

    render() {
        let text;
        if (this.props.winner == 'white') {
            text = "Red has won the game!"
        }

        if (this.props.winner == 'black') {
            text = "Black has won the game!"
        }
        return (

            <div style = {{ display: 'flex',
                justifyContent: 'center',
                paddingTop:'15px'
            }}>
                <h1>{text}</h1>
            </div>
        )
    }
}