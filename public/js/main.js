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
            this.creator = false;
            this.currentTurn = true;
            this.playsArr = [];
            this.hasCards = 0;
            this.createPlayerCards();
        }


        createPlayerCards() {
            for (var i = 0; i < 7; ++i) {
                var card = randCard();
                this.playsArr.push(card);
            }
            this.hasCards = 7;
        }

        wins() {
            return this.hasCards === 0;
        }

        getPlaysArr() {
            return this.playsArr;
        }

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
            this.reverse = 0;
            this.table = [];
        }

        createGameTable() {
            function cardClickHandler() {
                if (!player.getCurrentTurn() || !game) {
                    alert('Its not your turn!');
                    return;
                }

                if ($(this).prop('disabled')) {
                    alert('This tile has already been played on!');
                    return;
                }

                game.playTurn(this);
                this.remove();
                --player.hasCards;
                player.setCurrentTurn(false);
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

        getRoomId() {
            return this.roomId;
        }

        playTurn(cardElem) {
            const clickedCard = $(cardElem).attr('value');
            let draw, reverse = 0, hasSkip = 1;
            if(clickedCard.includes('rev'))
                reverse = 1;
            if(clickedCard.includes('skip'))
                hasSkip = 2;
            if(clickedCard.includes('+') && clickedCard[clickedCard.length - 1] === '2')
                draw = 2;
            if(clickedCard.includes('+') && clickedCard[clickedCard.length - 1] === '4')
                draw = 4;
            this.reverse ^= reverse;

            var next = (player.id + hasSkip*(this.reverse==1?-1:1) + 4)%4;
            socket.emit('playTurn', {
                card: clickedCard,
                room: this.getRoomId(),
                reverse,
                draw,
                next,
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
            // alert(winMessage);
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
        return color + '-' +  digit;
    }

    $('#new').on('click', () => {
        const name = $('#name').val();
        if (!name) {
            // alert('Please enter your name.');
            return;
        }
        $("#starterForm").hide();
        socket.emit('createGame', {
            name,
        });
        // player = new Player(name, 0);
    });

    $('#join').on('click', () => {
        const name = $('#name').val();
        const roomID = $('#room').val();
        if (!name || !roomID) {
            // alert('Please enter your name and game ID.');
            return;
        }
        $("#starterForm").hide();
        socket.emit('joinGame', {
            name,
            room: roomID
        });
        // player = new Player(name, 0);
    });
    
    $('#starterForm').submit(() => {return false;});

    socket.on('turnPlayed', (data) => {
        // TODO player logic to change image
        if(data.reverse === 0);
        else game.reverse ^= 1;
        $("#tableCard").html(data.card);
        console.log(data);
        if(data.next === player.id)
            player.setCurrentTurn(true);
    });
    
    socket.on('gameEnd', (data) => {
        game.endGame(data.message);
        socket.leave(data.room);
    });

    socket.on('err', (data) => {
        game.endGame(data.message);
    });

    socket.on('newGame', (data) => {
        const message =
            `Hello, ${data.name}.<br> Please ask your friend to enter Game ID: 
        ${data.room}.<br>Waiting for others..`;
        player = new Player(data.name, data.id);
        player.creator = true;
        game = new Game(data.room);
        game.displayCards(message);
        $("#starter_form").hide();
    });

    socket.on('player1', (data) => {
        $('#table').append(`<button class="btn btn-primary mx-1 my-1" value="${data.card}" id="tableCard">${data.card}</button>`);
        if(!player.creator) return false;
        const message = `Hello, ${player.getPlayerName()}`;
        $('#userHello').html(message);
        // $("#startGameDiv").append(`<button id="startGame" class="btn btn-primary">Start Game</button>`);
        // $("#startGame").on('click', () => {
        //     var color = CARDS[Math.floor(Math.random() * CARDS.length)];
        //     var digit = digits[Math.floor(Math.random() * 19)];
        //     var card = color + '-' + digit;
        //     socket.emit('gameStart', {card: card});
        //     $("#startGameDiv").remove();
        // });
        player.setCurrentTurn(true);
    });
  

    socket.on('player2', (data) => {
        const message = `Hello, ${data.name}`;
        player = new Player(data.name, data.id);
        game = new Game(data.room);
        game.displayCards(message);
        player.setCurrentTurn(false);
    });

}());