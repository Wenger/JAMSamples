import React from "react";

export default class Button extends React.Component {

    _buttonAct(e) {
        let result = this.props.states.filter((state) => this.props.state in state);
        let value = result.length > 0 ? result[0][this.props.state] : null;
        if (this.props.mode == 0) {
            this.props.trigger(this.props.id, value)
        } else if (this.props.mode == 1) {
            this.props.trigger(this.props.id, value);
            if (this.props.onStatus) {
                this._timer = setInterval(this.poll.bind(this), this.props.interval);
            } else {
                clearInterval(this._timer);
            }
            this.props.changeValue(!this.props.onStatus, this.props.onStatusName);
        }
    }

    poll() {
        let result = this.props.states.filter((state) => this.props.state in state);
        let value = result.length > 0 ? result[0][this.props.state] : null;
        this.props.trigger(this.props.id, value);
    }

    componentDidMount() {
        if (this.props.mode == 1 && this.props.onStatus) {
            this._timer = setInterval(this.poll.bind(this), this.props.interval);
        }
    }

    render() {
    	// connector
        let className = 'btn ' + (this.props.className||'')

        if (this.props.value == true) {
            className += ' active'
        }

        let label = "unknown_state"
        let result = this.props.states.filter((state) => this.props.state in state)

        if (result.length > 0) {
            label = this.props.state
        }

        return (
            <div>
                <div>{this.props.dispLabel}</div>
                <a className={className} key={this.props.id}
                   disabled={this.props.disabled}
                   title={this.props.title}
                   onClick={(e)=>this._buttonAct(e)}>
                    {label}
                </a>
            </div>
        )
    }
}