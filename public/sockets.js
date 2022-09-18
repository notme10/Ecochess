/**
 * @desc listens for playerConnect, logs player's name and information
 */
socket.on("playerConnect", (data) => {
    console.log(data.name);
    console.log(data.info);

    // if (side == 'w') {
    //     writeMessageBoard("white has connected");
    // }
    // else {
    //     writeMessageBoard("black has connected")
    // }
});

/**
 * @desc listens for sendMove, makes move
 */
socket.on("sendMove", (data) => {
    if (data.room === room && data.side !== side) {
        let pieceOnCoord = game.board.configuration.pieces[data.toCoords];
        let eatenPiece = pieceOnCoord ? pieceOnCoord : ""
        makeMove(data.fromCoords, data.toCoords, data.side, eatenPiece);

        {
        // cellCoord = data.moves.newPos.substring(0, 2);
        // pieceInfo = [data.moves.pieceName, data.moves.oldPos];
        // enemyPromotion = data.moves.display.split("=")[1];
        // console.log(data);
        // if (virtualBoard[convertRowsToIndex(data.moves.oldPos[1])][convertColsToIndex(data.moves.oldPos[0])]) {
        //     if(virtualBoard[convertRowsToIndex(cellCoord[1])][convertColsToIndex(cellCoord[0])]) {
        //         virtualBoard[convertRowsToIndex(data.moves.oldPos[1])][convertColsToIndex(data.moves.oldPos[0])].eat();
        //     } else {
        //         virtualBoard[convertRowsToIndex(data.moves.oldPos[1])][convertColsToIndex(data.moves.oldPos[0])].move();
        //     }
        // }
        }
    }
});

/**
 * @desc listens for sidesInfo, initializes side variable
 */
socket.on("sidesInfo", (data) => {
    // data is null pls fix
    console.log(data);
    if (!data) {
    } else if(data.w == name && side !== "w") {
        side = "w";
        // board.innerHTML = '';
        // generateBoard(side);
    } else if(data.b == name && side !== "b") {
        side = "b";
        // board.innerHTML = '';
        flipBoard();
        // generateBoard(side);
    } else if(side !== "w" && side !== "b") {
        side = "s";
        // board.innerHTML = '';
        // generateBoard(side);
    }
    // if there are two boards, fix this code
})

/**
 * @desc listens for playerDisconnect, show text on opponent's screen that opponent has disconnected
 */
// socket.on("playerDisconnect", (data) => {
//     if(data == "w") {
//         writeMessageBoard("white has disconnected");
//     } else {
//         writeMessageBoard("black has disconnected");
//     }
// });


