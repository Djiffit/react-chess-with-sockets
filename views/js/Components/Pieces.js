import React, {Component} from 'react';
import Board from './Board';
import Timer from './Timer';
import PieceStore from "../Stores/PieceStore";
import Title from "./Title";
import State from "./State";
import Chat from './Chat';
import * as MovePieceActions from "../Actions/MovePieceActions";
const io = require('socket.io-client');
import * as MessageActions from "../Actions/MessageActions";
const socket = io();

export default class Pieces extends Component {
    constructor() {
        super();
        socket.on('move', (payload) => {
            MovePieceActions.movePieceOnline(payload.sX, payload.sY, payload.eX, payload.eY, payload.blackTime, payload.whiteTime);
        });
        socket.on('join', (payload) => {
            console.log("joining");
            if (this.state.color == '') {
                MovePieceActions.movePieceOnline(payload.sX, payload.sY, payload.eX, payload.eY);
                this.setState({color:payload});
            }
        });
        this.state = {
            pieces:PieceStore.getAll(),
            black: false,
            winner: null,
            blackTime: 60.0,
            whiteTime: 60.0,
            color:''
        };
    }

    componentDidMount() {
        socket.emit('play');
    }

    componentWillMount() {
        PieceStore.on("move", (winner, sX, sY, eX, eY, eaten, moved) => {
            socket.emit('move', {winner, sX, sY, eX, eY, blackTime: this.state.blackTime, whiteTime:this.state.whiteTime, eaten, moved});
            this.state.black = !this.state.black;
            if (!this.state.black) {
                this.setState({
                    pieces: PieceStore.getAll(),
                    black: this.state.black,
                    winner: winner,
                    blackTime: this.state.blackTime + 3,
                    whiteTime: this.state.whiteTime
                });
            } else {
                this.setState({pieces: PieceStore.getAll(),
                    black: this.state.black,
                    winner: winner,
                    blackTime: this.state.blackTime,
                    whiteTime: this.state.whiteTime+3
                });
            }
        });
        PieceStore.on("moveOnline", (winner, sX, sY, eX, eY, blackTime, whiteTime) => {
            this.state.black = !this.state.black;
            if (!this.state.black) {
                this.setState({
                    pieces: PieceStore.getAll(),
                    black: this.state.black,
                    winner: winner,
                    blackTime: blackTime + 3,
                    whiteTime: whiteTime
                });
            } else {
                this.setState({pieces: PieceStore.getAll(),
                    black: this.state.black,
                    winner: winner,
                    blackTime: blackTime,
                    whiteTime: whiteTime+3
                });
            }
        });

        PieceStore.on("win", (black) =>{
            console.log("WON", black);
            this.setState({pieces: PieceStore.getAll(),
                black: this.state.black,
                winner: black,
                blackTime: this.state.blackTime,
                whiteTime: this.state.whiteTime+3
            });
        });

        PieceStore.on("refresh", (pawn, black) =>{
            this.setState({pieces: PieceStore.getAll(),
                black: this.state.black,
                winner: this.state.winner,
                blackTime: this.state.blackTime,
                whiteTime: this.state.whiteTime
            });
        });
    }

    componentWillUnmount () {
        clearInterval(this.timer);
        this.timer = null;
    }

    updateTime(reduce) {
        if (this.state.winner == null) {
            if (this.state.black) {
                this.setState({
                    pieces: PieceStore.getAll(),
                    black: this.state.black,
                    winner: this.state.winner,
                    blackTime: (this.state.blackTime - reduce),
                    whiteTime: this.state.whiteTime
                });
            } else {
                this.setState({
                    pieces: PieceStore.getAll(),
                    black: this.state.black,
                    winner: this.state.winner,
                    blackTime: this.state.blackTime,
                    whiteTime: (this.state.whiteTime - reduce)
                });
            }
        }
        if (this.state.blackTime < -1) {
            this.setState({winner: 'white'})
        }
        if (this.state.whiteTime < -1) {
            this.setState({winner: 'black'});
        }
    }

    render() {
        return (
            <div>
                <div className="row">
                    {/*<div>*/}
                    {/*<div style = {{ display: 'flex',*/}
                    {/*justifyContent: 'center',*/}
                    {/*paddingTop:'15px'*/}
                    {/*}}>*/}
                    {/*<button className="btn btn-default btn-sm">Restart</button>*/}
                    {/*</div>*/}
                    {/*</div>*/}
                </div>
                <div style={{paddingTop:'10px'}} className="row">
                    <div className="col-xs-3">
                        <Title color={this.state.color} black={this.state.black} />
                        <Timer blacktime={this.state.blackTime} whitetime={this.state.whiteTime} update={this.updateTime.bind(this)} blackTurn={this.state.black}/>
                        <State winner={this.state.winner}/>
                    </div>
                    <div style={{
                        display: 'flex',
                        maxHeight: '950px',
                        justifyContent: 'center',
                        cursor: 'crosshair'
                    }} className="App col-xs-6">
                        <Board color={this.state.color} won={this.state.winner} black={this.state.black} piecePositions={this.state.pieces}/>
                    </div>
                    <div className="col-xs-3">
                        <Chat socket={socket}/>
                    </div>
                </div>
            </div>
        );
    }
}

