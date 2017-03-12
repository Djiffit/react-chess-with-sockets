import React, {Component, PropTypes} from 'react';
import Piece from './Piece';
import {canMove} from './Rules';
import Square from './Square';
import * as MovePieceActions from '../Actions/MovePieceActions';

export default class Board extends Component {

    constructor() {
        super();
        this.state = {
            clicked: false,
            active: null,
        };
    }

    renderSquare(i) {
        const x = i % 8;
        const y = Math.floor(i / 8);
        const black = (x + y) % 2 === 1;
        var piece = null;
        for (var j = 0; j < this.props.piecePositions.white.length; ++j) {
            if (x === this.props.piecePositions.white[j].x && y === this.props.piecePositions.white[j].y) {
                piece = <Piece black={false} name={this.props.piecePositions.white[j].name} />
            }
        }
        for (var j = 0; j < this.props.piecePositions.black.length; ++j) {
            if (x === this.props.piecePositions.black[j].x && y === this.props.piecePositions.black[j].y) {
                piece = <Piece black={true} name={this.props.piecePositions.black[j].name}/>
            }
        }

        var movable = false;

        if (this.state.active) {
            movable = canMove(this.state.active.x, this.state.active.y, x, y, this.state.active.name, this.state.active.black, this.props.piecePositions);
        }

        const empty = piece == null ? false : true;
        return (
            <div onClick={() => this.handleSquareClick(x, y, piece)} key={i}
                 style={{ width: '12.5%', height: '12.5%' }}>
                <Square movable={movable} empty={empty} black={black}>
                    {piece}
                </Square>
            </div>
        );
    }

    handleSquareClick(x, y, piece) {
        if (this.props.color === 'black' === this.props.black) {
            if (this.props.won != null) {
                this.state.active = null;
                return;
            }
            if (piece != null) var black = piece.props.black;
            if (this.state.active != null && canMove(this.state.active.x, this.state.active.y, x, y, this.state.active.name, this.state.active.black, this.props.piecePositions)) {
                MovePieceActions.movePiece(this.state.active.x, this.state.active.y, x, y);
                this.setState({clicked: false, active: null});
            } else {
                if (piece != null) {
                    if (this.props.black === black) {
                        this.setState({
                            active: {
                                name: piece.props.name,
                                x: x,
                                y: y,
                                black: black
                            },
                            clicked: false
                        });
                    }
                }
            }
            this.state.clicked = true;
            setTimeout(() => {
                this.state.clicked = false;
            }, 300);
        }
    }

    render() {
        const squares = [];
        for (let i = 0; i < 64; i++) {
            squares.push(this.renderSquare(i));
        }

        return (
            <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexWrap: 'wrap'
            }}>
                {squares}
            </div>
        );
    }
}