/**
 * @desc when key Q is pressed, remove selected tag, and set fromCoord to null
 */
document.addEventListener("keypress", (e) => {
    if (e.key == "q") {
        let selectedCell = document.querySelector(".selected");

        if (selectedCell) {
            selectedCell.className = selectedCell.className.replace(
                " selected",
                ""
            );
        }
        clearMovableTiles();
        fromCoord = null;
    }
});

let board = document.getElementById("board"); // board
let width = 8; // width of the board
let height = 8; // height of the board
let columns = ["A", "B", "C", "D", "E", "F", "G", "H"]; // column letters, from left to right
let rows = ["8", "7", "6", "5", "4", "3", "2", "1"]; // row numbers ,from top to bottom

let whitePieces = ["P", "R", "B", "N", "Q", "K"]; // all white piece names
let blackPieces = ["p", "r", "b", "n", "q", "k"]; // all black piece names

/**
 * @desc determines the name of the piece with the given info
 * @param {String} side 
 * @param {String} pieceName 
 * @returns piece's name
 */
function pieceIdentifier(side, pieceName) {
    if (
        (side == "w" && whitePieces.includes(pieceName)) ||
        (side == "b" && blackPieces.includes(pieceName)) ||
        (side == "s" && whitePieces.includes(pieceName))
    ) {
        return "f" + pieceName.toLowerCase();
    } else {
        return "e" + pieceName.toLowerCase();
    }
}

/**
 * @desc when one tab is clicked, hide the other two
 */
listIcon.addEventListener("click", (e) => {
    document.getElementById("listIcon").style.backgroundColor = "#459dcc";
    document.getElementById("capturedPieceIcon").style.backgroundColor = "";
    document.getElementById("plugIcon").style.backgroundColor = "";

    document.getElementById("movesBox").style.display = "block";
    document.getElementById("capturedPieces").style.display = "none";
    document.getElementById("plugs").style.display = "none";
});

capturedPieceIcon.addEventListener("click", (e) => {
    document.getElementById("capturedPieceIcon").style.backgroundColor = "#459dcc";
    document.getElementById("listIcon").style.backgroundColor = "";
    document.getElementById("plugIcon").style.backgroundColor = "";

    document.getElementById("movesBox").style.display = "none";
    document.getElementById("capturedPieces").style.display = "flex";
    document.getElementById("plugs").style.display = "none";
});

plugIcon.addEventListener("click", (e) => {
    document.getElementById("plugIcon").style.backgroundColor = "#459dcc";
    document.getElementById("capturedPieceIcon").style.backgroundColor = "";
    document.getElementById("listIcon").style.backgroundColor = "";

    document.getElementById("movesBox").style.display = "none";
    document.getElementById("capturedPieces").style.display = "none";
    document.getElementById("plugs").style.display = "block";
});

/**
 * @desc clear and then refill the board
 */
function replaceBoard() {
    var arr = Array.prototype.slice.call(
        document.getElementsByClassName("cell")
    );

    for (tile in arr) {
        arr[tile].innerHTML = "";
    }

    fillBoard();
}

// generates board in the perspective of the s side
// no return

/**
 * 
 * @param {String} s 
 */
function generateBoard(s) {
    var topLeft = s !== "b";

    for (
        row = topLeft ? 0 : height - 1;
        topLeft ? row < height : row >= 0;
        row = topLeft ? row + 1 : row - 1
    ) {
        for (
            col = topLeft ? 0 : width - 1;
            topLeft ? col < width : col >= 0;
            col = topLeft ? col + 1 : col - 1
        ) {
            var cell = document.createElement("div");
            cell.addEventListener("click", (e) => {
                let newCoord = e.target.id; // get cellCoord
                if (newCoord) {
                    // clicked on a tile without piece
                    if (fromCoord) {
                        // clicked on a piece before
                        // console.log(e.target.className);
                        makeMove(fromCoord, newCoord, side, "");
                    }
                } else if (
                    document
                        .getElementById(e.target.classList[1])
                        .classList.contains("selected")
                ) {
                    document
                        .getElementById(e.target.classList[1])
                        .classList.remove("selected");
                    clearMovableTiles();
                    fromCoord = "";
                } else if (
                    (turn % 2 == 0 &&
                        whitePieces.includes(
                            e.target.className.substring(0, 1)
                        ) &&
                        side == "w") ||
                    (turn % 2 == 1 &&
                        blackPieces.includes(
                            e.target.className.substring(0, 1)
                        ) &&
                        side == "b")
                ) {
                    // clicked on a piece
                    // clear old selected pieces
                    let selectedCell = document.querySelector(".selected"); // gets the cell that is selected

                    if (selectedCell) {
                        selectedCell.className = selectedCell.className.replace(
                            " selected",
                            ""
                        ); // get rid of selected tag
                    }

                    pieceClicked = e.target.className.substring(0, 1);
                    fromCoord = e.target.className.split(" ")[1];
                    document.getElementById(fromCoord).className += " selected"; // add selected tag
                    showMoveableTiles(game.moves(fromCoord));
                } else if (
                    (turn % 2 == 1 &&
                        whitePieces.includes(
                            e.target.className.substring(0, 1)
                        ) &&
                        side == "b") ||
                    (turn % 2 == 0 &&
                        blackPieces.includes(
                            e.target.className.substring(0, 1)
                        ) &&
                        side == "w")
                ) {
                    // console.log("clicked on opponent's piece!");

                    if (fromCoord) {
                        const classList = e.target.className.split(" ");
                        newCoord = classList[1];

                        makeMove(fromCoord, newCoord, side, classList[0]);
                    }
                }
            });

            board.appendChild(cell);
            if ((row + col) % 2 == 0) {
                // white
                cell.className = `cell white${localStorage.getItem(
                    "chosenRegion"
                )}`;
            } else {
                // black
                cell.className = `cell black${localStorage.getItem(
                    "chosenRegion"
                )}`;
            }

            var bgFileName = `images/${localStorage.getItem(
                "chosenRegion"
            )}.png`;
            document.body.style.backgroundImage = "url(" + bgFileName + ")";
            cell.id = columns[col] + rows[row];
        }
    }
}

// function that mirrors every piece from one side to the other
// to make sure that my side is always fish, enemy side is trash
// no params or return
function flipBoard() {
    const BOARD = document.getElementById("board");
    let cellArray = Array.prototype.slice.call(BOARD.children);
    BOARD.innerHTML = "";
    for (i = cellArray.length - 1; i >= 0; i--) {
        BOARD.appendChild(cellArray[i]);
    }

    if (side === 'b') {
        document.getElementById("firstL").innerHTML = 'h';
        document.getElementById("secondL").innerHTML = 'g';
        document.getElementById("thirdL").innerHTML = 'f';
        document.getElementById("fourthL").innerHTML = 'e';
        document.getElementById("fifthL").innerHTML = 'd';
        document.getElementById("sixthL").innerHTML = 'c';
        document.getElementById("seventhL").innerHTML = 'b';
        document.getElementById("eighthL").innerHTML = 'a';

        document.getElementById("firstN").innerHTML = '8';
        document.getElementById("secondN").innerHTML = '7';
        document.getElementById("thirdN").innerHTML = '6';
        document.getElementById("fourthN").innerHTML = '5';
        document.getElementById("fifthN").innerHTML = '4';
        document.getElementById("sixthN").innerHTML = '3';
        document.getElementById("seventhN").innerHTML = '2';
        document.getElementById("eighthN").innerHTML = '1';
    }
}

/**
 * clears movable tiles from the previous selected piece
 */
function clearMovableTiles() {
    Array.from(document.querySelectorAll(".movable")).forEach((movableTile) => {
        // console.log(movableTile);
        movableTile.classList.remove("movable");
    });
}

/**
 * adds circles to every coord in possibleMoves
 * @param {array} possibleMoves
 */
function showMoveableTiles(possibleMoves) {
    clearMovableTiles();

    possibleMoves.forEach((coord) => {
        document.getElementById(coord).classList.add("movable"); // add movable tag
    });

    // 3) in the css, add some css for movableTiles
}

// piece at  moves to toCoords, movedSide is used to determine the message
// that is sent to the other player
// no return value
function makeMove(fromCoords, toCoords, movedSide, eatenPiece) {
    let madeMoves = {};
    let oldPiece = document.getElementById(fromCoords).childNodes[0];
    if (!oldPiece) {
        return;
    }
    let pieceClasses = oldPiece.classList;

    try {
        game.move(fromCoords, toCoords);
    } catch (err) {
        alert("Invalid Move");
        return;
    }

    //pushMoveMessage();
    // console.log(pieceClicked, fromCoords, toCoords);
    oldPiece.remove(); // removes piece from old square
    socket.emit("makeMove", {
        fromCoords: fromCoords,
        toCoords: toCoords,
        room: room,
        side: movedSide,
    });
    madeMoves = {from: fromCoords, to: toCoords};
    moveList.push(madeMoves);

    let selectedCell = document.querySelector(".selected"); // gets the cell that is selected
    if (selectedCell) {
        selectedCell.className = selectedCell.className.replace(
            " selected",
            ""
        ); // removes selected tag
    }

    replaceBoard();
    if (eatenPiece) {
        console.log(eatenPiece);
        clearMovableTiles();
        recordCapturedPieces(eatenPiece);
    }
    clearMovableTiles();

    pushMoveMessage(fromCoords, toCoords);

    if (isCheckMate()) {
        alert("Game Over");
    }

    if (game.board.history.length !== 0) {
        clearHighlightHistory();
    }

    highlightHistory();
    turn++;
}

// returns index value of the given row
function convertRowsToIndex(row) {
    return rows.indexOf(row);
}

// returns index value of the given column
function convertColsToIndex(col) {
    return columns.indexOf(col);
}

// returns row of the given index
function convertIndexToRows(index) {
    return rows[index];
}

// returns column of the given index
function convertIndexToCols(index) {
    return columns[index];
}

/**
 * puts captured piece in captured piece list. also makes the div
 * @param {String} pieceToCapture 
 */
function recordCapturedPieces(pieceToCapture) {
    capturedPieces.push(pieceToCapture);
    // item  is undefined because capturedPIeces is literally empty, so no other code works
    var item = capturedPieces[capturedPieces.length-1];
    console.log(item);
    if (side !== getPieceSide(item)) {
        var capturedPiece = document.createElement("div");
        capturedPiece.className = "e" + item.toLowerCase();
        capturedPiece.style.width = "75px";
        capturedPiece.style.height = "75px";
        document.getElementById("capturedPieces").appendChild(capturedPiece);
    }
}

/**
 * checks if piece is white
 * @param {String} piece the piece
 * @returns returns true if white
 */
function isWhitePiece(piece) {
    return whitePieces.includes(piece);
}

/**
 * checks if piece is black
 * @param {String} piece 
 * @returns true if piece is black
 */
function isBlackPiece(piece) {
    return blackPieces.includes(piece);
}

/**
 * gives the side/color of the piece
 * @param {String} piece 
 * @returns side/color of the piece ("w" or "b")
 */
function getPieceSide(piece) {
    if (isWhitePiece(piece)) {
        return "w";
    }
    return "b";
}

function writeMessageBoard(message) {
    document.getElementById("messageBoard").innerHTML = message;
}

/**
 * checks if there is a checkmate
 * @returns true if checkmate and false when not
 */
function isCheckMate() {
    return JSON.stringify(game.moves()) === '{}'
}

// sends the moveMessage that will be displayed on the opponent's screen
// no params
// no returns
function pushMoveMessage(fromCoords, toCoords) {
    const movedPiece = game.board.configuration.pieces[toCoords];
    if (isWhitePiece(movedPiece)) {
        var newMove = document.createElement("div");
        var turnDiv = document.createElement("div");
        var whiteMove = document.createElement("div");

        newMove.classList += "move";

        turnDiv.innerText = Math.floor(turn / 2)+1;

        whiteMove.innerText = `w ${movedPiece} moved from ${fromCoords} to ${toCoords}`;

        newMove.appendChild(turnDiv);
        newMove.appendChild(whiteMove);
        document.querySelector("#movesBox").appendChild(newMove);
    }

    else {
        var blackMove = document.createElement("div");
        blackMove.innerText = `b ${movedPiece} moved from ${fromCoords} to ${toCoords}`;

        var moveBox = document.querySelector("#movesBox");
        var newMove = moveBox.lastElementChild;
        newMove.appendChild(blackMove);
    }

}

function getPrvCoords() {
    return moveList[moveList.length-1].from;
}

function getNewCoords() {
    return moveList[moveList.length-1].to;
}

function isWhiteTile(tile) {
    
}

/**
 * highlights moved tiles
 * @returns undefined
 */
//light: #dbb8ff ; dark: #ad5cff
function highlightHistory() {
    console.log("should come after")
    console.trace()
    let light = "#dbb8ff";
    let dark = "#ad5cff";

    if (isBlackTile(getPrvCoords())) {
        document.getElementById(getPrvCoords()).style.backgroundColor = dark;
        if (isWhiteTile(getNewCoords())) {
            document.getElementById(getNewCoords()).style.backgroundColor = light;
        }
        else {
        document.getElementById(getNewCoords()).style.backgroundColor = dark;
        }
        
    }
    else {
        document.getElementById(getPrvCoords()).style.backgroundColor = light;
        if (isBlackTile(getNewCoords())) {
            document.getElementById(getNewCoords()).style.backgroundColor = dark;
        }
        else {
            document.getElementById(getNewCoords()).style.backgroundColor = light;
        }
    }
    
}

function clearHighlightHistory() {
    console.log("should come before")
    console.trace()
    tiles = document.getElementsByClassName("cell")

    for (let i = 0; i < tiles.length; i++) {
        tile = tiles[i]

        if (isBlackTile(tile.id)) {
            tile.style.backgroundColor = "#0f6796";
        }
        else {
            tile.style.backgroundColor = "#ffffff";
        }
    }
    // document.getElementById(getPrvCoords()).style.backgroundColor = "";
    // document.getElementById(getNewCoords()).style.backgroundColor = "";

}

function isBlackTile(coordinate) {
    let letter = "ABCDEFGH";
    let number = "12345678";
    let total = 0;

    total = letter.indexOf(coordinate[0]) + number.indexOf(coordinate[1]);

    if (total % 2 == 0) {
        return true;
    }

    return false;
}

/**
 * 
 * @param {String} coordinate 
 * @returns true if tile is white
 */
function isWhiteTIle(coordinate) {
    let letter = "ABCDEFGH";
    let number = "12345678";
    let total = 0;

    total = letter.indexOf(coordinate[0]) + number.indexOf(coordinate[1]);

    if (total % 2 == 0) {
        return false;
    }

    return true;
}

var modal = document.getElementById("homeModal"); // white screen that contains all the buttons and boxes
var randomizerButton = document.getElementById("randomRoom");
var goToRoom = document.getElementById("goToRoom");
var nameInput = document.getElementById("nameInput");
var roomInput = document.getElementById("roomInput");

// assigns a random value using Math.random to roomInput.value
// no params
// no return
randomizerButton.addEventListener("click", (e) => {
    roomInput.value = Math.floor(Math.random() * 10000000);
    navigator.clipboard.writeText(roomInput.value);
    alert("Room Code copied to clipboard");
    //make into a popup later
});

// adds room code and name to the end of the game url
goToRoom.addEventListener("click", (e) => {
    location.href = "/?r=" + roomInput.value + "&n=" + nameInput.value;
});
