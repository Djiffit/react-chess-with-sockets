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

let startValues = {
    pieces:PieceStore.getAll(),
    black: false,
    winner: null,
    blackTime: 60.0,
    whiteTime: 60.0,
    color:'',
    room:'',
    gameBegun: false
}

export default class Pieces extends Component {
    constructor() {
        super();
        socket.on('move', (payload) => {
            if (payload.room === this.state.room) {
                MovePieceActions.movePieceOnline(payload.sX, payload.sY, payload.eX, payload.eY, payload.blackTime, payload.whiteTime);
            }
        });
        socket.on('disconnect', (payload) => {
            console.log(" ON DISCONNECT ", this.state.room);
            socket.emit('disc', {room: this.state.room});
        });
        socket.on('receiveState', (payload) => {
            this.state = (payload);
            payload.color === 'black' ? this.setState({color:'white'}) : this.setState({color:'black'});
            MovePieceActions.setBoard(payload.pieces);
        });
        socket.on('disc', (payload) => {
            if (payload.room === this.state.room) {
                MessageActions.sendMessage("A player left the game.")
            }
        });
        socket.on('restart', (payload) => {
            if (payload.room === this.state.room) {
                MovePieceActions.newGame();
            }
        });
        socket.on('join', (payload) => {
            if (payload.room == this.state.room) {
                if (this.state.color == '') {
                    this.setState({color: payload.color});
                    startValues.color = payload.color;
                } else {
                    if (this.state.gameBegun) {
                        socket.emit('sendState', this.state);
                    }
                    MessageActions.sendMessage("A player joined the game.")
                }
            }
        });
        this.state = startValues;
    }

    componentDidMount() {
        this.state.room = window.location.pathname;
        startValues.room = window.location.pathname;
        socket.room = this.state.room;
        socket.emit('play', {room:this.state.room});
    }

    componentWillMount() {
        PieceStore.on("move", (winner, sX, sY, eX, eY, eaten, moved) => {
            socket.emit('move', {winner, sX, sY, eX, eY, blackTime: this.state.blackTime, whiteTime:this.state.whiteTime, eaten, moved, room:this.state.room});
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
                this.state.gameBegun = true;
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
            console.log('REFRESH')
            this.setState({pieces: PieceStore.getAll(),
                black: this.state.black,
                winner: this.state.winner,
                blackTime: this.state.blackTime,
                whiteTime: this.state.whiteTime
            });
            console.log(this.state);
        });
        PieceStore.on("newgame", () =>{
            this.setState(
                startValues
            );
            this.setState({pieces: PieceStore.getAll()});
        });
        window.onbeforeunload = () => {
            socket.emit('disc', {room: this.state.room});
        }
    }

    componentWillUnmount () {
        console.log("unmount");
        // clearInterval(this.timer);
        // this.timer = null;
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

    changeColor() {
        const newc = this.state.color == 'black' ? 'white' : 'black';
        startValues.color = newc;
        const col = newc == 'black' ? 'Black' : 'Red';
        socket.emit('newMessage', {room:this.state.room, newMessage:("A player changed their color to " + col)});
        this.setState({color:newc})
    }

    restartGame() {
        socket.emit('restart', {room:this.state.room});
        socket.emit('newMessage', {room:this.state.room, newMessage:("The game has been restarted.")});
    }

    render() {
        return (
            <div>
                <div style={{paddingTop:'10px'}} className="row">
                    <div className="col-xs-3">
                        <Title color={this.state.color} black={this.state.black} />
                        <Timer blacktime={this.state.blackTime} whitetime={this.state.whiteTime} update={this.updateTime.bind(this)} blackTurn={this.state.black}/>
                        <State winner={this.state.winner}/>
                        <div style={{
                            display: 'flex',
                            maxHeight: '950px',
                            justifyContent: 'center'}}>
                            <button style={{
                                display: 'flex',
                                justifyContent: 'center'}} onClick={this.changeColor.bind(this)} className="btn btn-default btn-sm">Change color</button>
                            <button style={{
                                display: 'flex',
                                justifyContent: 'center'}} onClick={this.restartGame.bind(this)} className="btn btn-default btn-sm">Restart Game</button>
                        </div>
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
                        <Chat room={this.state.room} socket={socket}/>
                    </div>
                </div>
            </div>
        );
    }
}

