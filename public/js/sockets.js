const socket = io.connect('http://localhost:5000');

socket.on('turnPlayed', (data) => {
    // TODO player logic to change image
    if (data.reverse === 0);
    else game.reverse ^= 1;

    console.log(data);
    if (data.next === player.id)
        player.setCurrentTurn(true);

    if (data.drawCards != data.next && player.id === data.drawCards) {
        for (var i = 0; i < data.draw; ++i) {
            ++player.hasCards;
            var card = randCard();
            var randId = makeid(5);
            var src = './img/uno_card-'+initArray[i]+'.webp';
            $("#mycards").append(`<div class="col"><img src="${src}" class="uno-card img-responsive" style="width:100%;" alt = "${card}" value="${card}" id="${randId}"/></div>`);
            $(`#${randId}`).on('click', cardClickHandler);
        }
        $("#userHello").html("You were made to draw " + data.draw);
    }
    $("#tableCard").html(data.card);
    game.updateDeck();
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
    game.updateDeck();
    if (!player.creator) return false;
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