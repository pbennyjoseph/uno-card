const express = require('express');
const path = require('path');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

let rooms = 0;
const CARDS = ['r', 'b', 'g', 'y'];
const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'rev', 'skip', 'wild', '+2', '+4'];

// app.use(express.static('../../public'));

io.on('connection', (socket) => {

    socket.on('createGame', (data) => {
        socket.join(`room-${++rooms}`);
        socket.emit('newGame', {
            name: data.name,
            room: `room-${rooms}`,
            id: 0
        });
        console.log('Creating new game');
    });

    socket.on('joinGame', function (data) {
        var room = io.nsps['/'].adapter.rooms[data.room];
        if (room && room.length <= 3) {
            socket.join(data.room);
            socket.emit('player2', {
                name: data.name,
                room: data.room,
                id: room.length - 1,
            })

            if (room.length === 4) {
                var color = CARDS[Math.floor(Math.random() * CARDS.length)];
                var digit = digits[Math.floor(Math.random() * 19)];
                var card = color + '-' + digit;
                // socket.broadcast.to(data.room).emit('player1', {
                //     card
                // })
                socket.nsp.to(data.room).emit('player1', { card });
            }
        } else {
            socket.emit('err', {
                message: 'Sorry, The room is full!'
            });
        }
        console.log('joining new game');
    });

    socket.on('playTurn', (data) => {
        socket.broadcast.to(data.room).emit('turnPlayed', data);
    });

    socket.on('gameEnded', (data) => {
        socket.broadcast.to(data.room).emit('gameEnd', data);
    });
});

server.listen(process.env.PORT || 5000);