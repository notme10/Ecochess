var socket = io();
var enemyPromotion;
//var pieces = {};

var pieceInfo; // information of the piece you want to move
var cellCoord; // clicked cell's coordinates

var turn = 0; // turn counter

var moveList = []; // list of moves that either player made, which is printed in the box
var capturedPieces = []; // list of captured pieces

var loser = ""; // stores the loser, which is used in the end screen
var side = "s"; // side of the player

const params = new URLSearchParams(window.location.search);
var room = Object.fromEntries(params.entries())["r"]; // room code
var name = Object.fromEntries(params.entries())["n"]; // inputted name of the player

if(!room) {
    // room = prompt("Which room would you like to join?");
    // location.href = "/?r=" + room;
    document.getElementById("homeModal").style.display = "block"; // if room DNE, when website is opened, show homeModal
} else {
    socket.emit('setRoom', {room:room}); // emit setRoom
    socket.emit("playerName", {name:name}); // emit playerName
}

// if chosenRegion doesn't exist, set it to Ocean
if(!localStorage.getItem("chosenRegion")) {
    localStorage.setItem("chosenRegion", "Ocean");
}
