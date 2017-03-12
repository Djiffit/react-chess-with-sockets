import React, {Component} from 'react';

export default class Piece extends Component {
    render() {
        const scale = this.props.scale == null ? 1 : this.props.scale;
        const {black, name} = this.props;
        var symbol;
        if (black) {
            switch(name) {
                case "Rook" : {
                    symbol = "♜";
                    break;
                }
                case "Pawn" : {
                    symbol = "♟";
                    break;
                }
                case "King" : {
                    symbol = "♚";
                    break;
                }
                case "Knight" : {
                    symbol = "♞";
                break;
            }
                case "Queen" : {
                    symbol = "♛	";
                    break;
                }
                case "Bishop" : {
                    symbol = "♝";
                    break;
                }
            }
        } else {
            switch(name) {
                case "Rook" : {
                    symbol = "♖";
                    break;
                }
                case "Pawn" : {
                    symbol = "♙";
                    break;
                }
                case "King" : {
                    symbol = "♔";
                    break;
                }
                case "Knight" : {
                    symbol = "♘";
                    break;
                }
                case "Queen" : {
                    symbol = "♕	";
                    break;
                }
                case "Bishop" : {
                    symbol = "♗";
                    break;
                }
            }
        }
        const color = black ? 'black' : 'black';
        const shadow = black ? '' : '-1px 1px 1px red';

        return <span style={{fontSize: scale*4 + 'vw',
            textAlign:'center',
            userSelect:'none',
            color:color,
            textShadow: shadow
        }} >{symbol}</span>
    }
}