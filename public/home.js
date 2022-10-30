let time = 0;

let playerNameDiv = document.getElementById("playerName");
let roomCodeDiv = document.getElementById("roomCode");
let generateCodeDiv = document.getElementById("generateCode");

playerNameDiv.addEventListener("change", (e) => {
    playerName = playerNameDiv.value;
});

roomCodeDiv.addEventListener("change", (e) => {
    roomCode = roomCodeDiv.value;
});

one.addEventListener("click", (e) => {
    time = 1;
});

five.addEventListener("click", (e) => {
    time = 5;
});

ten.addEventListener("click", (e) => {
    time = 10;
});

twenty.addEventListener("click", (e) => {
    time = 20;
});


generateCodeDiv.addEventListener("click", (e) => {
    roomCode = Math.floor(Math.random() * 10000000);
    navigator.clipboard.writeText(roomCode);
    roomCodeDiv.value = roomCode;
});

createRoom.addEventListener("click", (e) => {
    if(playerName && roomCode && time) {
        console.log("create room");
        location.href = "/game/?r=" + roomCode + "&n=" + playerName;
    } else {
        document.getElementById("error").style.display = "block";
        setTimeout(() => {
            document.getElementById("error").style.display = "none";
          }, "5000")
    }
});