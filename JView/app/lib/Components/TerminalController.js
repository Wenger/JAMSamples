import React from "react";
import io from 'socket.io-client';
import {observer} from 'mobx-react';
import Terminal from 'terminal-in-react';


@observer
export default class TerminalController extends React.Component {

    render() {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    width: "100vh"
                }}
            >
                <Terminal
                    allowTabs={ false }
                    color='green'
                    backgroundColor='black'
                    barColor='black'
                    style={{ fontWeight: "bold", fontSize: "1em" }}
                    watchConsoleLogging={ false }
                    shortcuts={{
                    'darwin,win,linux': {
                        'ctrl + a': 'echo whoo',
                    },
                    }}
                    commandPassThrough={(cmd, print) => {

                        const command = cmd.slice(0).join(' ');

                        this.props.trigger(command, this.props.commandsListName)

                        const socket = io('http://localhost:3000')
                        socket.emit("emitValue", { id: this.props.id, value: command });

                        let callback = body => {
                            if (body.id == this.props.id) {
                                print(body.value)
                            }

                            // remove listener for this particular command when receive response from backend
                            socket.removeListener('terminalResponse', callback)
                        }

                        socket.on('terminalResponse', callback)
                    }}
                    commands={{
                        history: (args, print, runCommand) => {
                            this.props.commands.forEach((command) => print(command))
                        }
                    }}
                />
            </div>
        )
    }
}
