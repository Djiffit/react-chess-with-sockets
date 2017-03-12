"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const http = require('http');

const app = express();

var port = process.env.PORT || 8080;

// Run server to listen on port 3000.
const server = app.listen(port, () => {
    console.log('listening on *:3000');
});

const io = require('socket.io')(server);

app.use(bodyParser.urlencoded({ extended: false } ));
app.use(express.static('static'));
let counter = 0;
// Set socket.io listeners.
io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disc', (data) => {
        console.log(data);
        io.emit('disc', data);
    });

    socket.on('play', (data) => {
        let color = 'black';
        if (counter % 2 == 0) color = 'white';
        data.color = color;
        io.emit('join', data);
        counter++;
    });

    socket.on('sendState', (data) => {
        io.emit('receiveState', data);
    });

    socket.on('restart', (data) => {
        io.emit('restart', data);
    });

    socket.on('move', function(data) {
        io.emit('move', data);
    });

    socket.on('newMessage', function(data) {
        io.emit('newMessage', data);
    });
});



// Set Express routes.
app.get('', (req, res) => {
    var where = Math.floor(Math.random() * 10000000);
    res.redirect('/' +where);
});
app.get('/', (req, res) => {
    var where = Math.floor(Math.random() * 10000000);
    res.redirect('/' +where);
});
function serveIndex(req, res) {
    res.sendFile(__dirname + '/views/index.html');
}
app.get('*', serveIndex);
app.head('*', serveIndex);