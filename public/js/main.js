// main functions to interact with backend

// variables start ------------
var btnJoinGame = document.getElementById('JoinGame');
var btnCreateGame = document.getElementById('CreateGame');

// variables end---------------


// functions start ------------------
function checkName(){
	var value = document.getElementById("name").value;
    if (value === '') {
      alert('Enter your name');
      return false;
    }
    return true;
}

function checkCode(){
	var value = document.getElementById("code").value;
    if (value === '') {
      alert('Enter the code');
      return false;
    }
    return true;
}


// checks if name is entered and starts game else alerts
btnCreateGame.addEventListener("click",function(){
    if(checkName()) {
    	// start game if true

    }
});

// checks if name and code is entered and starts game else alerts
btnJoinGame.addEventListener("click",function(){
    if(checkName() && checkCode()){
    	// start game if true


    }
});



// functions end-------------------------

