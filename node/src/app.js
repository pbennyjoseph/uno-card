const express = require('express');
const path = require('path');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

let rooms = 0;

app.use(express.static('../../public'));

io.on('connection', (socket) => {

    // Create a new game room and notify the creator of game.
    socket.on('createGame', (data) => {
        socket.roomLength = data.length
        socket.join(`room-${++rooms}`);
        socket.emit('newGame', {
            name: data.name,
            room: `room-${rooms}`
        });
        console.log('Creating new game');
    });

    // Connect the Player 2 to the room he requested. Show error if room full.
    socket.on('joinGame', function (data) {
        var room = io.nsps['/'].adapter.rooms[data.room];
        if (room && room.length <= 3) {
            socket.join(data.room);
            socket.broadcast.to(data.room).emit('player1', {});
            socket.emit('player2', {
                name: data.name,
                room: data.room
            })
        } else {
            socket.emit('err', {
                message: 'Sorry, The room is full!'
            });
        }

        console.log('joining new game');
    });

    /**
     * Handle the turn played by either player and notify the other.
     */
    socket.on('playTurn', (data) => {
        socket.broadcast.to(data.room).emit('turnPlayed', data);
    });

    /**
     * Notify the players about the victor.
     */
    socket.on('gameEnded', (data) => {
        socket.broadcast.to(data.room).emit('gameEnd', data);
    });
});

server.listen(process.env.PORT || 5000);