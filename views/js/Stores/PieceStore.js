import React, {Component} from 'react';
import dispatcher from "../dispatcher";
import { EventEmitter } from "events";
import { pieceAt } from '../Components/Rules';
import * as MovePieceActions from "../Actions/MovePieceActions";
import * as MessageActions from "../Actions/MessageActions";

class PieceStore extends EventEmitter {
    constructor() {
        super();
        this.state = {
            white: [
                {
                    name: 'Pawn',
                    x: 0,
                    y: 6,
                    black: false
                },
                {
                    name: 'Pawn',
                    x: 1,
                    y: 6,
                    black: false
                },
                {
                    name: 'Pawn',
                    x: 2,
                    y: 6,
                    black: false
                },
                {
                    name: 'Pawn',
                    x: 3,
                    y: 6,
                    black: false
                },
                {
                    name: 'Pawn',
                    x: 4,
                    y: 6,
                    black: false
                },
                {
                    name: 'Pawn',
                    x: 5,
                    y: 6,
                    black: false
                },
                {
                    name: 'Pawn',
                    x: 6,
                    y: 6,
                    black: false
                },
                {
                    name: 'Pawn',
                    x: 7,
                    y: 6,
                    black: false
                },
                {
                    name: 'Rook',
                    x: 0,
                    y: 7,
                    black: false
                },
                {
                    name: 'Knight',
                    x: 1,
                    y: 7,
                    black: false
                },
                {
                    name: 'Bishop',
                    x: 2,
                    y: 7,
                    black: false
                },
                {
                    name: 'Queen',
                    x: 3,
                    y: 7,
                    black: false
                },
                {
                    name: 'King',
                    x: 4,
                    y: 7,
                    black: false
                },
                {
                    name: 'Bishop',
                    x: 5,
                    y: 7,
                    black: false
                },
                {
                    name: 'Knight',
                    x: 6,
                    y: 7,
                    black: false
                },
                {
                    name: 'Rook',
                    x: 7,
                    y: 7,
                    black: false
                },
            ],
            black: [
                {
                    name: 'Pawn',
                    x: 0,
                    y: 1,
                    black: true
                },
                {
                    name: 'Pawn',
                    x: 1,
                    y: 1,
                    black: true
                },
                {
                    name: 'Pawn',
                    x: 2,
                    y: 1,
                    black: true
                },
                {
                    name: 'Pawn',
                    x: 3,
                    y: 1,
                    black: true
                },
                {
                    name: 'Pawn',
                    x: 4,
                    y: 1,
                    black: true
                },
                {
                    name: 'Pawn',
                    x: 5,
                    y: 1,
                    black: true
                },
                {
                    name: 'Pawn',
                    x: 6,
                    y: 1,
                    black: true
                },
                {
                    name: 'Pawn',
                    x: 7,
                    y: 1,
                    black: true
                },
                {
                    name: 'Rook',
                    x: 0,
                    y: 0,
                    black: true
                },
                {
                    name: 'Knight',
                    x: 1,
                    y: 0,
                    black: true
                },
                {
                    name: 'Bishop',
                    x: 2,
                    y: 0,
                    black: true
                },
                {
                    name: 'Queen',
                    x: 3,
                    y: 0,
                    black: true
                },
                {
                    name: 'King',
                    x: 4,
                    y: 0,
                    black: true
                },
                {
                    name: 'Bishop',
                    x: 5,
                    y: 0,
                    black: true
                },
                {
                    name: 'Knight',
                    x: 6,
                    y: 0,
                    black: true
                },
                {
                    name: 'Rook',
                    x: 7,
                    y: 0,
                    black: true
                },
            ]
        }

    }

    movePiece(sX, sY, eX, eY) {
        var indexToRemove = null;
        var indexToUpdate = null;
        let winner = null;
        let black = true;
        let eaten = null;
        let moved = null;

        for (var j = 0; j < this.state.white.length; ++j) {
            if (sX === this.state.white[j].x && sY === this.state.white[j].y) {
                indexToUpdate = j;
            }
            if (eX === this.state.white[j].x && eY === this.state.white[j].y) {
                indexToRemove = j;
            }
        }
        if (indexToUpdate != null) {
            this.state.white[indexToUpdate].x = eX;
            this.state.white[indexToUpdate].y = eY;
            moved = this.state.white[indexToUpdate];
            if (this.state.white[indexToUpdate].name == 'Pawn' && eY == 0)  this.state.white[indexToUpdate].name = 'Queen';
            black = false;
        }
        if (indexToRemove != null) {
            eaten = this.state.white[indexToRemove];
            if (this.state.white[indexToRemove].name == 'King') winner = 'black';
            this.state.white[indexToRemove].x = -50;
            this.state.white[indexToRemove].y = -50;
        }
        //this.state.white.splice(indexToRemove, 1);


        indexToRemove = null;
        indexToUpdate = null;
        for (var j = 0; j < this.state.black.length; ++j) {
            if (sX === this.state.black[j].x && sY === this.state.black[j].y) {
                indexToUpdate = j;
            }
            if (eX === this.state.black[j].x && eY === this.state.black[j].y) {
                indexToRemove = j;
            }
        }
        if (indexToUpdate != null) {
            this.state.black[indexToUpdate].x = eX;
            this.state.black[indexToUpdate].y = eY;
            moved = this.state.black[indexToUpdate];
            if (this.state.black[indexToUpdate].name == 'Pawn' && eY == 7) this.state.black[indexToUpdate].name = 'Queen';
        }
        if (indexToRemove != null) {
            eaten = this.state.black[indexToRemove];
            if (this.state.black[indexToRemove].name == 'King') winner = 'white';
            this.state.black[indexToRemove].x = -50;
            this.state.black[indexToRemove].y = -50;
        }
        return {winner, eaten, moved};
        //this.state.black.splice(indexToRemove, 1);
    }

    movePieceOnline(sX, sY, eX, eY, blackTime, whiteTime) {
        let winner = this.movePiece(sX, sY, eX, eY)
        this.emit("moveOnline", winner.winner, sX, sY, eX, eY, blackTime, whiteTime, winner.eaten, winner.moved);
    }

    movePieceOffline(sX, sY, eX, eY) {
        let winner = this.movePiece(sX, sY, eX, eY)
        this.emit("move", winner.winner, sX, sY, eX, eY, winner.eaten, winner.moved);
    }
    getAll() {
        return this.state;
    }

    handleActions(action) {
        switch(action.type) {
            case "MOVE_PIECE": {
                this.movePieceOffline(action.sX, action.sY, action.eX, action.eY);
                break;
            }
            case "MOVE_PIECE_ONLINE": {
                if (pieceAt(action.sX, action.sY, this.state)) {
                    this.movePieceOnline(action.sX, action.sY, action.eX, action.eY, action.blackTime, action.whiteTime);
                }
                break;
            }
        }
    }
}
const pieceStore = new PieceStore;
dispatcher.register(pieceStore.handleActions.bind(pieceStore));
export default pieceStore;