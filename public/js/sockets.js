const socket = io.connect('http://unocard-game.herokuapp.com');

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
            pushCard(card);
        }
        $("#userHello").html("You were made to draw " + data.draw);
    }
    var src = './img/uno_card-'+ data.card +'.webp';
    $("#tableCard").attr('src', src);
});

socket.on('gameEnd', (data) => {
    game.endGame(data.message);
    socket.leave(data.room);
});

socket.on('err', (data) => {
    alert('Something went wront with us or the room does not exist!');
    location.reload();
});

socket.on('newGame', (data) => {
    const message =
        `Hello, ${data.name}.<br> Please ask your friends to enter Game ID: 
        ${data.room}<br>Waiting for others..`;
    player = new Player(data.name, data.id);
    player.creator = true;
    game = new Game(data.room);
    game.displayCards(message);
    $("#starter_form").hide();
});

socket.on('player1', (data) => {
    var src = './img/uno_card-'+ data.card +'.webp' ;
    $('#allCards').show();
    $('#table').append(`<img src="${src}" class="img-responsive" style="width: 200px; height: 200px;" alt = "${data.card}" value="${data.card}" id="tableCard"/>`);
    if (!player.creator) return false;
    const message = `Hello, ${player.getPlayerName()}`;
    $('#userHello').html(message);
    player.setCurrentTurn(true);
});


socket.on('player2', (data) => {
    const message = `Hello, ${data.name}`;
    player = new Player(data.name, data.id);
    game = new Game(data.room);
    game.displayCards(message);
    player.setCurrentTurn(false);
});