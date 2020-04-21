function randCard() {
    var color = CARDS[Math.floor(Math.random() * CARDS.length)];
    var digit = digits[Math.floor(Math.random() * digits.length)];
    return color + digit;
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

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