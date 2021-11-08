var socket = io();

var pieces = {};
var pieceInfo;
var cellCoord;
var turn = 0;
var moveList = [];
var capturedPieces = [];
var loser = "";
var side = "";
const params = new URLSearchParams(window.location.search);
var room = Object.fromEntries(params.entries())["r"];
socket.emit('setRoom', {room:room});
var name = prompt("What is your name? ");
socket.emit("playerName", {name:name});
