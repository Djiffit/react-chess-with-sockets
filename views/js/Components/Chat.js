import React from 'react';
import MessageStore from "../Stores/MessageStore";
import Message from './Message';
import Piece from './Piece';
import * as MessageActions from "../Actions/MessageActions";

export default class Chat extends React.Component {

    constructor() {
        super();
        this.state = {
            messages: MessageStore.getAll(),
            newMessage: ''
        }
    }

    componentWillMount() {
        MessageStore.on("newMessage", () => {
            this.setState({messages:MessageStore.getAll()})
            const panel = document.getElementById('scrollablePanel');
            panel.scrollTop = panel.scrollHeight;
        });
        this.props.socket.on('newMessage', (content) => {
            MessageActions.sendMessage(content);
        });
        this.props.socket.on('move', (content) => {
            //MessageActions.sendMessage(content.moved.name + " moved  to " + content.eX + " " + content.eY );
            MessageActions.reportMovement(content.moved, content.eaten, content.sX, content.sY)
        });
    }

    renderMessage(i) {
        try {
            const scale = 0.73;
            if (this.state.messages[i].moved == null) throw error;
            if (this.state.messages[i].eaten == null) {
                return (
                    <div style={{fontSize: 1 + 'vw'}}>
                        <Piece scale={scale} name={this.state.messages[i].moved.name} black={this.state.messages[i].moved.black}/>
                        Moved to [{Math.abs(this.state.messages[i].moved.x + 1 - 8)}, {Math.abs(this.state.messages[i].moved.y + 1 - 8)}]
                    </div>
                )
            } else {
                return (
                <div style={{fontSize: 1 + 'vw'}}>
                    <Piece scale={scale} name={this.state.messages[i].moved.name} black={this.state.messages[i].moved.black}/>
                    Captured <Piece scale={scale} name={this.state.messages[i].eaten.name} black={this.state.messages[i].eaten.black}/> at [{Math.abs(this.state.messages[i].moved.x + 1-8)}, {Math.abs(this.state.messages[i].moved.y + 1 - 8)}]
                </div>
                )
            }
        } catch (err) {
            const message = <Message content= {this.state.messages[i]} key={i} />
            return (message);
        }
    }


    handleChange(e) {
        const title = e.target.value;
        this.state.newMessage = title;
    }

    sendMessage(e) {
        e.preventDefault();
        if (this.state.newMessage.length > 0) {
            this.props.socket.emit('newMessage', this.state.newMessage);
            this.state.newMessage = '';
            document.getElementById('messageField').value = '';
        }
    }

    render() {
        const squares = [];
        for (let i = 0; i < this.state.messages.length; i++) {
            squares.push(this.renderMessage(i));
        }
        return (
            <div style={{width: '100%', height:'80vh'}} className="container">
                <div id="scrollablePanel" style={{width: '100%', height:'75vh', overflowY:'scroll'}} className="panel panel-default">
                    <ul class="list-group">
                        {squares}
                    </ul>
                </div>
                <div className="panel-footer">
                    <form onSubmit={this.sendMessage.bind(this)}>
                        <div className="input-group">
                        <span className="input-group-btn">
                            <button onClick={this.sendMessage.bind(this)} className="btn btn-default" type="button">Send</button>
                        </span>
                            <input id="messageField" style={{autocomplete:"off"}} onChange={this.handleChange.bind(this)} type="text" className="form-control" placeholder="Message"/>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}