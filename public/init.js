var socket = io();

var pieces = {};
var pieceInfo;
var cellCoord;
var turn = 0;
var moveList = [];
var capturedPieces = [];
var loser = "";
var side = "";
var name = prompt("What is your name? ");

socket.emit("playerName", {name:name});
