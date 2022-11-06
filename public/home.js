// const { Socket } = require("socket.io");
let socket = io();
let time = 0;
let playerNameDiv = document.getElementById("playerName");
let roomCodeDiv = document.getElementById("roomCode");
let generateCodeDiv = document.getElementById("generateCode");

let roomData = [
    
];

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
    if (playerName && roomCode && time) {
        console.log("create room");
        location.href = "/game/?r=" + roomCode + "&n=" + playerName;
    } else {
        document.getElementById("error").style.display = "block";
        setTimeout(() => {
            document.getElementById("error").style.display = "none";
        }, "5000");
    }
});

function updateTable() {
    var table = document.getElementById("tableBody");
    table.innerHTML = '';

    for (roomInfo of roomData) {

        var row = document.createElement("tr");
        table.appendChild(row);

        var joinButton = row.insertCell(0);
        var name = row.insertCell(1);
        var roomCode = row.insertCell(2);
        var players = row.insertCell(3);
        var status = row.insertCell(4);

        joinButton.innerHTML = '<button class="btn btn-info">Join</button>';
        name.innerHTML = `<div>${roomInfo.w}</div>`;
        roomCode.innerHTML = `<div>${roomInfo.roomCode}</div>`;
        players.innerHTML = `<div>${roomInfo.playerCount}</div>`;
        status.innerHTML = `<div>${roomInfo.status}</div>`;
    }
}

socket.emit("getRooms", { });

socket.on("updateRooms", (data) => {
    updateTable();
    console.log("table should be updated here");
})








// send a message via sockets to the server called "getrooms"
// server is gonna recieve it and use rooms variable to find all available rooms
// and send those rooms back to home.js
// home.js is gonna use the info to add it to the list!
// make sure table shows the correct information
