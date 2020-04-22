function randCard() {
    let color, digit;
    if(Math.random() < 0.8){
        color = CARDS[Math.floor(Math.random() * CARDS.length)];
        digit = digits[Math.floor(Math.random() * digits.length)];
    }
    else{
        color = '';
        digit = special[Math.floor(Math.random() * special.length)];
    }
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
    var cardSlug = $(this).attr('value');
    var tableSlug = $("#tableCard").attr('value');
    var valid = false;
    for(i in special){
        if(valid) break;
        if(cardSlug.includes(special[i]))
            valid = true;
    }
    for(i in CARDS){
        if(valid) break;
        if(cardSlug.includes(CARDS[i]) && tableSlug.includes(CARDS[i]))
            valid = true;
    }
    for(i in digits){
        if(valid) break;
        if(cardSlug.includes(CARDS[i]) && tableSlug.includes(digits[i]))
            valid = true;
    }
    if(!valid) return false;
    game.playTurn(this);
    this.remove();
    --player.hasCards;
    player.setCurrentTurn(false);
    game.checkWinner();
}

function pushCard(card){
    var randId = makeid(5);
    var src = './img/uno_card-'+ card +'.webp';
    $("#mycards").append(`<div class="col"><img src="${src}" class="uno-card img-responsive" style="width:100%;" alt = "${card}" value="${card}" id="${randId}"/></div>`);
    $(`#${randId}`).on('click', cardClickHandler);
}