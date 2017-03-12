import React, {Component} from 'react';
import dispatcher from "../dispatcher";
import { EventEmitter } from "events";
import { pieceAt } from '../Components/Rules';
import * as MovePieceActions from "../Actions/MovePieceActions";

class MessageStore extends EventEmitter {
    constructor() {
        super();
        this.state = {messages:[]};
    }

    getAll() {
        return this.state.messages;
    }

    newMessage(content){
        this.state.messages.push(content);
        this.emit('newMessage');
    }

    newEvent(moved, eaten, sX, sY) {
        this.state.messages.push({
            moved, eaten, sX, sY
        });
        this.emit('newMessage');
    }

    handleActions(action) {
        switch(action.type) {
            case "SEND_MESSAGE": {
                this.newMessage(action.content);
                break;
            }
        }
        switch(action.type) {
            case "SEND_EVENT": {
                this.newEvent(action.moved, action.eaten, action.sX, action.sY);
                break;
            }
        }
    }
}
const messageStore = new MessageStore;
dispatcher.register(messageStore.handleActions.bind(messageStore));
export default messageStore;