// main functions to interact with backend

// variables start ------------
var btnJoinGame = document.getElementById('JoinGame');
var btnCreateGame = document.getElementById('CreateGame');

// variables end---------------

function checkName(){
	var value = document.getElementById("name").value;
    if (value === '') {
      alert('Enter your name');
    }
}

function checkCode(){
	var value = document.getElementById("code").value;
    if (value === '') {
      alert('Enter the code');
    }
}


// checks if name is entered and starts game else alerts
btnCreateGame.addEventListener("click",function(){
    checkName();
});

// checks if name and code is entered and starts game else alerts
btnJoinGame.addEventListener("click",function(){
    checkName();
	checkCode();

});

