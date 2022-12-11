/**
 * @desc listens for playerConnect, logs player's name and information
 */
socket.on("playerConnect", (data) => {
    if(data.info.b) {
        gameInProgress = true;
    }
});

/**
 * @desc listens for sendMove, makes move
 */
socket.on("sendMove", (data) => {
    if (data.room === room && data.side !== side) {
        let pieceOnCoord = game.board.configuration.pieces[data.toCoords];
        let eatenPiece = pieceOnCoord ? pieceOnCoord : ""
        makeMove(data.fromCoords, data.toCoords, data.side, eatenPiece);
    }
});

/**
 * @desc listens for sidesInfo, initializes side variable
 */
socket.on("sidesInfo", (data) => {
    console.log(data);
    if (!data) {
    } else if(data.w == name && side !== "w") {
        side = "w";
    } else if(data.b == name && side !== "b") {
        side = "b";
        flipBoard();
    } else if(side !== "w" && side !== "b") {
        side = "s";
    }
})


