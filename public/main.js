// if key Q is pressed, remove selected tag
// set fromCoord to null
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

let board = document.getElementById("board"); // We are getting the board into the JS
let width = 8; // width of the board
let height = 8; // height of the board
let columns = ["A", "B", "C", "D", "E", "F", "G", "H"]; // column letters, from left to right
let rows = ["8", "7", "6", "5", "4", "3", "2", "1"]; // row numbers ,from top to bottom

let whitePieces = ["P", "R", "B", "N", "Q", "K"]; // self explanatory
let blackPieces = ["p", "r", "b", "n", "q", "k"]; // self explanatory

// function that determines the piece name of the given info
// parameters: side (black or white) and pieceName (in arrays whitePieces and blackPieces)
// returns either friendly pieceName or enemy pieceName
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

// piece at fromCoords moves to toCoords, movedSide is used to determine the message
// that is sent to the other player
// no return value
function makeMove(fromCoords, toCoords, movedSide, eatenPiece) {
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
    // console.log(pieceClicked, fromCoords, toCoords);
    oldPiece.remove(); // removes piece from old square
    socket.emit("makeMove", {
        fromCoords: fromCoords,
        toCoords: toCoords,
        room: room,
        side: movedSide,
    });

    let selectedCell = document.querySelector(".selected"); // gets the cell that is selected
    if (selectedCell) {
        selectedCell.className = selectedCell.className.replace(
            " selected",
            ""
        ); // removes selected tag
    }

    replaceBoard();

    if (eatenPiece) {
        clearMovableTiles();
        recordCapturedPieces();
    }
    clearMovableTiles();
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
    var item = capturedPieces[capturedPieces.length - 1];
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

// sends the moveMessage that will be displayed on the opponent's screen
// no params
// no returns
function pushMoveMessage() {
    var lastMove = moveList[moveList.length - 1];

    if (lastMove.color == "w") {
        var newMove = document.createElement("div");
        var turn = document.createElement("div");
        var whiteMove = document.createElement("div");

        newMove.classList += "move";

        turn.innerText = Math.ceil(moveList.length / 2);

        whiteMove.innerText = lastMove.display;

        newMove.appendChild(turn);
        newMove.appendChild(whiteMove);
        document.querySelector("#movesBox").appendChild(newMove);
    } else {
        var blackMove = document.createElement("div");
        blackMove.innerText = lastMove.display;

        var moveBox = document.querySelector("#movesBox");
        var newMove = moveBox.lastElementChild;
        newMove.appendChild(blackMove);
    }
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
