let game;
let fromCoord; // where the piece was at before the move was made
let pieceClicked; // piece that was clicked (that the player wants to move)
let fillBoard;

let board = document.getElementById("board"); // board
let width = 8; // width of the board
let height = 8; // height of the board
let columns = ["A", "B", "C", "D", "E", "F", "G", "H"]; // column letters, from left to right
let rows = ["8", "7", "6", "5", "4", "3", "2", "1"]; // row numbers ,from top to bottom

let whitePieces = ["P", "R", "B", "N", "Q", "K"]; // all white piece names
let blackPieces = ["p", "r", "b", "n", "q", "k"]; // all black piece names

let socket = io();
let enemyPromotion;
//let pieces = {};

let pieceInfo; // information of the piece you want to move
let cellCoord; // clicked cell's coordinates

let turn = 0; // turn counter

let moveList = []; // list of moves that either player made, which is printed in the box
let capturedPieces = []; // list of captured pieces

let loser = ""; // stores the loser, which is used in the end screen
let side = "s"; // side of the player

const params = new URLSearchParams(window.location.search);
let room = Object.fromEntries(params.entries())["r"]; // room code
let name = Object.fromEntries(params.entries())["n"]; // inputted name of the player

let whiteTI = document.getElementById("whiteTI");
let blackTI = document.getElementById("blackTI");

let messageBoard = document.getElementById("messageBoard");
let modal = document.getElementById("homeModal");
let randomizerButton = document.getElementById("randomRoom");
let goToRoom = document.getElementById("goToRoom");
let nameInput = document.getElementById("nameInput");
let roomInput = document.getElementById("roomInput");
let copyModal = document.getElementById("alertModal");

let firstL = document.getElementById("firstL");
let secondL = document.getElementById("secondL");
let thirdL = document.getElementById("thirdL");
let fourthL = document.getElementById("fourthL");
let fifthL = document.getElementById("fifthL");
let sixthL = document.getElementById("sixthL");
let seventhL = document.getElementById("seventhL");
let eighthL = document.getElementById("eighthL");

let firstN = document.getElementById("firstN");
let secondN = document.getElementById("secondN");
let thirdN = document.getElementById("thirdN");
let fourthN = document.getElementById("fourthN");
let fifthN = document.getElementById("fifthN");
let sixthN = document.getElementById("sixthN");
let seventhN = document.getElementById("seventhN");
let eighthN = document.getElementById("eighthN");

let turnIndicator = document.getElementById("turnIndicator");

let listIcon = document.getElementById("listIcon");
let capturedPieceIcon = document.getElementById("capturedPieceIcon");
let plugIcon = document.getElementById("plugIcon");

let movesBox = document.getElementById("movesBox");
let capturedPiecesList = document.getElementById("capturedPieces");
let plugs = document.getElementById("plugs");

let maxTimer = 600;

if (!room) {
    document.getElementById("homeModal").style.display = "block"; // if room DNE, when website is opened, show homeModal
} else {
    socket.emit("setRoom", { room: room }); // emit setRoom
    socket.emit("playerName", { name: name }); // emit playerName
}

// if chosenRegion doesn't exist, set it to Ocean
if (!localStorage.getItem("chosenRegion")) {
    localStorage.setItem("chosenRegion", "Ocean");
}

let gameInProgress = false;