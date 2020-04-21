const CARDS = ['red', 'blue', 'green', 'yellow'];
const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'reverse', 'skip', 'wild', '+2', '+4'];
let player;
let game;

$('.footer').hide();
$('.card').hide();

$('#new').on('click', () => {
    const name = $('#name').val();
    if (!name) {
        // alert('Please enter your name.');
        return;
    }
    $("#starterForm").hide();
    
    $('.footer').show();
    $('.card').show();

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

    $('.footer').show();
    $('.card').show();

    socket.emit('joinGame', {
        name,
        room: roomID
    });
    // player = new Player(name, 0);
});

$('#starterForm').submit(() => {
    return false;
});