// Root File for Node Service 
const express = require('express');const http = require('http');const bodyParser = require('body-parser');const socketIo = require('socket.io');const webpack = require('webpack');const webpackDevMiddleware = require('webpack-dev-middleware');const webpackConfig = require('./webpack.config.js');const util = require('util');const exec = require('child_process').exec;const app = express();const server = http.createServer(app);const io = socketIo(server);
webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());app.use(express.static(__dirname+'/'));app.use(webpackDevMiddleware(webpack(webpackConfig)));app.use(bodyParser.urlencoded({extended:false}));app.use(require('webpack-hot-middleware')(webpack(webpackConfig)));
server.listen(3000);    app.get('*', (req, res) => {    console.log('Orignal Path: ' + req.url);    res.sendFile(__dirname+'/index.html');    });    console.log('Server Has Been Hosted On Port : 3000');
io.on('connection', socket => {    console.log('connected');    socket.on('message', body =>{        socket.broadcast.emit('message', {            body,            from: socket.id.slice(8)        });    });    socket.on('newDataPoint', body =>{        console.log('new data point received: '+body.x+','+body.y);        socket.broadcast.emit('newDataPoint', {            body,            from: socket.id.slice(8)        });    });    socket.on('disconnect', function() {        console.log('disconnect');    });    socket.on('emitValue', body => {        console.log(body);        if (body.id === '1') {            let randomIdx = Math.floor((Math.random() * 3) + 0);            let states = ['state_1', 'state_2', 'state_3'];            let randomState = states[randomIdx];            socket.emit('changeValue', {                id: '4',                name: 'currentState',                value: randomState            })        }        if (body.id === '2') {            socket.emit('changeValue', {                id: '3',                name: 'disabledState3',                value: true            })        } else if (body.id === '5') {            child = exec(body.value, function (error, stdout, stderr) {                socket.emit('terminalResponse', {                    id: '5',                    value: stdout + stderr                })            });        }    });});