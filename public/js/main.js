const CARDS = ['r', 'b', 'g', 'y'];
const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'rev', 'skip', 'wild', '+2', '+4'];

(function init() {
    let player;
    let game;

    const socket = io.connect('http://localhost:5000');

    class Player {
        constructor(name, id) {
            this.name = name;
            this.id = id;
            this.currentTurn = true;
            this.playsArr = [];
            this.createPlayerCards();
        }


        createPlayerCards() {
            for (var i = 0; i < 7; ++i) {
                var card = randCard();
                this.playsArr.push(card);
            }
        }

        get wins() {
            return this.playsArr.length == 0;
        }

        getPlaysArr() {
            return this.playsArr;
        }

        // Set the currentTurn for player to turn and update UI to reflect the same.
        setCurrentTurn(turn) {
            this.currentTurn = turn;
            const message = turn ? 'Your turn' : 'Waiting for others..';
            $('#turn').text(message);
        }

        getPlayerName() {
            return this.name;
        }

        getCurrentTurn() {
            return this.currentTurn;
        }
    }

    class Game {
        constructor(roomId, player) {
            this.roomId = roomId;
            this.table = [];
        }

        createGameTable() {
            function cardClickHandler() {
                const row = parseInt(this.id.split('_')[1][0], 10);
                const col = parseInt(this.id.split('_')[1][1], 10);
                if (!player.getCurrentTurn() || !game) {
                    alert('Its not your turn!');
                    return;
                }

                if ($(this).prop('disabled')) {
                    alert('This tile has already been played on!');
                    return;
                }

                game.playTurn(this);
                game.updateCards(player.getPlayerType(), row, col, this.id);

                player.setCurrentTurn(false);
                player.updatePlaysArr(1 << ((row * 3) + col));

                game.checkWinner();
            }
            var initArray = player.getPlaysArr();
            for (var i = 0; i < initArray.length; ++i) {
                $("#mycards").append(`<button class="btn btn-primary mx-1 my-1" value="${initArray[i]}" id="${i}">${initArray[i]}</button>`)
                $(`#${i}`).on('click', cardClickHandler);
            }
        }
        displayCards(message) {
            $('#userHello').html(message);
            this.createGameTable();
        }

        updateCards(cardElem) {
            cardElem.remove();
        }

        getRoomId() {
            return this.roomId;
        }

        playTurn(cardElem) {
            const clickedCard = cardElem.attr('value');

            socket.emit('playTurn', {
                card: clickedCard,
                room: this.getRoomId(),
            });
        }

        checkWinner() {
            if (player.wins()) {
                game.announceWinner();
            }
        }

        announceWinner() {
            winMessage = `${player.getPlayerName()} wins!`;
            socket.emit('gameEnded', {
                room: this.getRoomId(),
                message: winMessage,
            });
            alert(winMessage);
            location.reload();
        }

        endGame(message) {
            alert(message);
            location.reload();
        }
    }

    function randCard() {
        var color = CARDS[Math.floor(Math.random() * CARDS.length)];
        var digit = digits[Math.floor(Math.random() * digits.length)];
        return color + digit;
    }

    $('#new').on('click', () => {
        const name = $('#name').val();
        if (!name) {
            alert('Please enter your name.');
            return;
        }
        socket.emit('createGame', {
            name,
        });
        // player = new Player(name, 0);
    });

    $('#join').on('click', () => {
        const name = $('#name').val();
        const roomID = $('#room').val();
        if (!name || !roomID) {
            alert('Please enter your name and game ID.');
            return;
        }
        socket.emit('joinGame', {
            name,
            room: roomID
        });
        // player = new Player(name, 0);
    });

    // New Game created by current client. Update the UI and create new Game var.
    socket.on('newGame', (data) => {
        const message =
            `Hello, ${data.name}. Please ask your friend to enter Game ID: 
        ${data.room}. Waiting for others..`;
        player = new Player(data.name, data.id);
        game = new Game(data.room);
        game.displayCards(message);
    });

    /**
     * If player creates the game, he'll be P1(X) and has the first turn.
     * This event is received when opponent connects to the room.
     */
    socket.on('player1', (data) => {
        const message = `Hello, ${player.getPlayerName()}`;
        $('#userHello').html(message);
        player.setCurrentTurn(true);
    });

    socket.on('player2', (data) => {
        const message = `Hello, ${data.name}`;
        game = new Game(data.room);
        game.displayCards(message);
        player = new Player(data.name, data.id);
        player.setCurrentTurn(false);
    });

    socket.on('turnPlayed', (data) => {
        const row = data.tile.split('_')[1][0];
        const col = data.tile.split('_')[1][1];
        const opponentType = player.getPlayerType() === P1 ? P2 : P1;

        game.updateCards(card);
        player.setCurrentTurn(true);
    });

    // If the other player wins, this event is received. Notify user game has ended.
    socket.on('gameEnd', (data) => {
        game.endGame(data.message);
        socket.leave(data.room);
    });

    /**
     * End the game on any err event. 
     */
    socket.on('err', (data) => {
        game.endGame(data.message);
    });


}());