import React from 'react';
import PieceStore from '../Stores/PieceStore';

export default class Timer extends React.Component {

    constructor() {
        super();
        this.state = {
            running: false
        };
    }

    componentWillMount() {
        PieceStore.on("move", () => {
            let start = false;
            if (!this.state.running) {
                start = true;
                this.state.running = true;
            }
            if (start) this.timer = setInterval(this.tick.bind(this), 100);
        });
        PieceStore.on("moveOnline", () => {
            let start = false;
            if (!this.state.running) {
                start = true;
                this.state.running = true;
            }
            if (start) this.timer = setInterval(this.tick.bind(this), 100);
        });
    }

    tick() {
        this.props.update(0.1);
    }

    render() {
        return(
            <div>
                <div className="d-flex align-content-start flex-wrap" style={{
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <h1 style ={{fontSize: '3vw',
                        textAlign:'center',
                        userSelect:'none',}}>Black time: <b>{this.props.blacktime.toFixed(1)} s</b></h1>

                </div>
                <div className="d-flex align-content-end flex-wrap" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    minHeight: '100%'
                }}>
                    <br/>
                    <h1 style={{fontSize: '3vw',
                        textAlign:'center',
                        userSelect:'none',
                    }}>Red time: <b>{this.props.whitetime.toFixed(1)} s</b></h1>
                </div>
            </div>
        );
    }
}
