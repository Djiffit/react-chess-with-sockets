import React, {Component} from 'react';

export default class Message extends Component {

    render() {
        return (
        <li className="list-group-item">
            {this.props.content}
        </li>
        )
    }

}