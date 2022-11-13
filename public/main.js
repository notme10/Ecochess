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

document.getElementById("myTimer").innerText =
    "Player1 time: " + convertTime(maxTimer);
document.getElementById("opponentTimer").innerText =
    "Player2 time: " + convertTime(maxTimer);

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

listIcon.addEventListener("click", (e) => {
    listIcon.style.backgroundColor = "#459dcc";
    capturedPieceIcon.style.backgroundColor = "";
    plugIcon.style.backgroundColor = "";

    movesBox.style.display = "block";
    capturedPiecesList.style.display = "none";
    plugs.style.display = "none";
});

capturedPieceIcon.addEventListener("click", (e) => {
    capturedPieceIcon.style.backgroundColor = "#459dcc";
    listIcon.style.backgroundColor = "";
    plugIcon.style.backgroundColor = "";

    movesBox.style.display = "none";
    capturedPieces.style.display = "flex"; // change to grid
    plugs.style.display = "none";
});

plugIcon.addEventListener("click", (e) => {
    plugIcon.style.backgroundColor = "#459dcc";
    capturedPieceIcon.style.backgroundColor = "";
    listIcon.style.backgroundColor = "";

    movesBox.style.display = "none";
    capturedPieces.style.display = "none";
    plugs.style.display = "block";
});

function replaceBoard() {
    let arr = Array.prototype.slice.call(
        document.getElementsByClassName("cell")
    );

    for (tile in arr) {
        arr[tile].innerHTML = "";
    }

    fillBoard();
}

function generateBoard(s) {
    let topLeft = s !== "b";

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
            let cell = document.createElement("div");
            cell.addEventListener("click", (e) => {
                if (!gameInProgress) {
                    return;
                }

                let newCoord = e.target.id; // get cellCoord
                if (newCoord) {
                    // clicked on a tile without piece
                    if (fromCoord) {
                        // clicked on a piece before
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

            let bgFileName = `images/background_images/${localStorage
                .getItem("chosenRegion")
                .toLowerCase()}.png`;
            document.body.style.backgroundImage = "url(" + bgFileName + ")";
            cell.id = columns[col] + rows[row];
        }
    }
}

function flipBoard() {
    const BOARD = document.getElementById("board");
    let cellArray = Array.prototype.slice.call(BOARD.children);
    BOARD.innerHTML = "";
    for (i = cellArray.length - 1; i >= 0; i--) {
        BOARD.appendChild(cellArray[i]);
    }

    if (side === "b") {
        firstL = "h";
        secondL = "g";
        thirdL = "f";
        fourthL = "e";
        fifthL = "d";
        sixthL = "c";
        seventhL = "b";
        eighthL = "a";

        firstN = "8";
        secondN = "7";
        thirdN = "6";
        fourthN = "5";
        fifthN = "4";
        sixthN = "3";
        seventhN = "2";
        eighthN = "1";
        turnIndicator = "column-reverse";
    }
}

function clearMovableTiles() {
    Array.from(document.querySelectorAll(".movable")).forEach((movableTile) => {
        // console.log(movableTile);
        movableTile.classList.remove("movable");
    });
}

function showMoveableTiles(possibleMoves) {
    clearMovableTiles();

    possibleMoves.forEach((coord) => {
        document.getElementById(coord).classList.add("movable"); // add movable tag
    });
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

    oldPiece.remove(); // removes piece from old square
    socket.emit("makeMove", {
        fromCoords: fromCoords,
        toCoords: toCoords,
        room: room,
        side: movedSide,
    });
    madeMoves = { from: fromCoords, to: toCoords };
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

    function checkmateMessage() {
        alert("Checkmate! Game over!");
    }

    if (isCheckMate()) {
        if (turn % 2 == 0) {
            copyModal.style.color = "black";
            document.getElementsByClassName("closebtn").item(0).style.color =
                "black";
            displayAlertModal("Game Over: White Wins.", "#ffffff");
        } else {
            copyModal.style.color = "black";
            document.getElementsByClassName("closebtn").item(0).style.color =
                "black";
            displayAlertModal("Game Over: Black Wins.", "#ffffff");
        }
    }

    if (game.board.history.length !== 0) {
        clearHighlightHistory();
    }

    highlightHistory();
    turn++;

    if (turn % 2 == 0) {
        console.log("white's turn");
        if (side === "b") {
            whiteTI.style.backgroundColor = "transparent";
            blackTI.style.backgroundColor = "#006592";
        } else {
            whiteTI.style.backgroundColor = "#006592";
            blackTI.style.backgroundColor = "transparent";
        }
    } else {
        console.log("black's turn");
        if (side === "b") {
            blackTI.style.backgroundColor = "transparent";
            whiteTI.style.backgroundColor = "#006592";
        } else {
            blackTI.style.backgroundColor = "#006592";
            whiteTI.style.backgroundColor = "transparent";
        }
    }
}

// TIMER
let timer1 = maxTimer;
let timer2 = maxTimer;

function convertTime(timeSeconds) {
    let minutes = Math.floor(timeSeconds / 60);
    let seconds = timeSeconds - minutes * 60;
    if (seconds.toString().length == 1) {
        seconds = "0" + seconds;
    }
    convertedTime = "" + minutes + ":" + seconds;
    return convertedTime;
}

function decreaseTimer() {
    if (turn == 0) {
        return;
    }

    if (turn % 2 == 0) {
        // white's turn
        timer1--;
        document.getElementById("myTimer").innerText =
            "Player1 time: " + convertTime(timer1);

        if (timer1 == 0) {
            alert("Black wins!");
            gameInProgress = false;
            clearInterval(timer);
        }
    } else {
        timer2--;
        document.getElementById("opponentTimer").innerText =
            "Player2 time: " + convertTime(timer2);

        if (timer2 == 0) {
            alert("White wins!");
            gameInProgress = false;
            clearInterval(timer);
        }
    }
}

timer = setInterval(decreaseTimer, 1000);

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
    let item = capturedPieces[capturedPieces.length - 1];
    console.log(item);
    if (side !== getPieceSide(item)) {
        let capturedPiece = document.createElement("div");
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

function isBlackPiece(piece) {
    return blackPieces.includes(piece);
}

function getPieceSide(piece) {
    if (isWhitePiece(piece)) {
        return "w";
    }
    return "b";
}

function writeMessageBoard(message) {
    messageBoard.innerHTML = message;
}

function isCheckMate() {
    return JSON.stringify(game.moves()) === "{}";
}

function pushMoveMessage(fromCoords, toCoords) {
    const movedPiece = game.board.configuration.pieces[toCoords];
    if (isWhitePiece(movedPiece)) {
        let newMove = document.createElement("div");
        let turnDiv = document.createElement("div");
        let whiteMove = document.createElement("div");

        newMove.classList += "move";

        turnDiv.innerText = Math.floor(turn / 2) + 1;

        whiteMove.innerText = `w ${movedPiece} moved from ${fromCoords} to ${toCoords}`;

        newMove.appendChild(turnDiv);
        newMove.appendChild(whiteMove);
        document.querySelector("#movesBox").appendChild(newMove);
    } else {
        let blackMove = document.createElement("div");
        blackMove.innerText = `b ${movedPiece} moved from ${fromCoords} to ${toCoords}`;

        let moveBox = document.querySelector("#movesBox");
        let newMove = moveBox.lastElementChild;
        newMove.appendChild(blackMove);
    }
}

function getPrvCoords() {
    return moveList[moveList.length - 1].from;
}

function getNewCoords() {
    return moveList[moveList.length - 1].to;
}

function highlightHistory() {
    console.log("should come after");
    console.trace();
    let light = "#dbb8ff";
    let dark = "#ad5cff";

    if (isBlackTile(getPrvCoords())) {
        document.getElementById(getPrvCoords()).style.backgroundColor = dark;
        if (isWhiteTile(getNewCoords())) {
            document.getElementById(getNewCoords()).style.backgroundColor =
                light;
        } else {
            document.getElementById(getNewCoords()).style.backgroundColor =
                dark;
        }
    } else {
        document.getElementById(getPrvCoords()).style.backgroundColor = light;
        if (isBlackTile(getNewCoords())) {
            document.getElementById(getNewCoords()).style.backgroundColor =
                dark;
        } else {
            document.getElementById(getNewCoords()).style.backgroundColor =
                light;
        }
    }
}

function clearHighlightHistory() {
    console.log("should come before");
    console.trace();
    tiles = document.getElementsByClassName("cell");

    for (let i = 0; i < tiles.length; i++) {
        tile = tiles[i];

        if (isBlackTile(tile.id)) {
            tile.style.backgroundColor = "#0f6796";
        } else {
            tile.style.backgroundColor = "#ffffff";
        }
    }
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

function isWhiteTile(coordinate) {
    let letter = "ABCDEFGH";
    let number = "12345678";
    let total = 0;

    total = letter.indexOf(coordinate[0]) + number.indexOf(coordinate[1]);

    if (total % 2 == 0) {
        return false;
    }

    return true;
}

function getNewCoords() {
    return game.board.history[game.board.history["length"] - 1].to;
}

function displayAlertModal(msg, color) {
    document.getElementById("modalMessage").innerText = msg;
    copyModal.style.backgroundColor = color;
    copyModal.style.display = "block";
}

randomizerButton.addEventListener("click", (e) => {
    roomInput.value = Math.floor(Math.random() * 10000000);
    navigator.clipboard.writeText(roomInput.value);
    copyModal.style.boxShadow = "none";
    displayAlertModal("Room code successfully copied to clipboard.", "#058700");
});

goToRoom.addEventListener("click", (e) => {
    location.href = "/?r=" + roomInput.value + "&n=" + nameInput.value;
});
