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
        var initArray = player.getPlaysArr();
        for (var i = 0; i < initArray.length; ++i) {
            var randId = makeid(5)
            $("#mycards").append(`<button class="btn btn-primary mx-1 my-1" value="${initArray[i]}" id="${randId}">${initArray[i]}</button>`)
            $(`#${randId}`).on('click', cardClickHandler);
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
        $("#tableCard").html(clickedCard);
        console.log("inside playTurn with");
        console.log(cardElem);
        let draw, reverse = 0,
            hasSkip = 1;
        if (clickedCard.includes('rev'))
            reverse = 1;
        if (clickedCard.includes('skip'))
            hasSkip = 2;
        if (clickedCard.includes('+') && clickedCard[clickedCard.length - 1] === '2')
            draw = 2;
        if (clickedCard.includes('+') && clickedCard[clickedCard.length - 1] === '4')
            draw = 4;
        this.reverse ^= reverse;

        var drawCards = (player.id + hasSkip * (this.reverse == 1 ? -1 : 1) + 4) % 4;
        var next = (drawCards + (draw === 2 || draw === 4) * (this.reverse == 1 ? -1 : 1) + 4) % 4;
        socket.emit('playTurn', {
            card: clickedCard,
            room: this.getRoomId(),
            reverse,
            draw,
            next,
            drawCards,
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