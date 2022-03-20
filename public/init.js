var socket = io();
var enemyPromotion;
//var pieces = {};
var pieceInfo;
var cellCoord;
var turn = 0;
var moveList = [];
var capturedPieces = [];
var loser = "";
var side = "";
const params = new URLSearchParams(window.location.search);
var room = Object.fromEntries(params.entries())["r"];
var name = Object.fromEntries(params.entries())["n"];

if(!room) {
    // room = prompt("Which room would you like to join?");
    // location.href = "/?r=" + room;
    document.getElementById("homeModal").style.display = "block";
} else {
    socket.emit('setRoom', {room:room});
    socket.emit("playerName", {name:name});
}

if(!localStorage.getItem("chosenRegion")) {
    localStorage.setItem("chosenRegion", "Ocean");
}
