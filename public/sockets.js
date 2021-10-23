socket.on("playerConnect", (data) => {
    console.log(data.name);
    // console.log(data.sides);
});

socket.on("sendMove", (data) => {
    console.log(data);
    cellCoord = data.newPos;
    pieceInfo = [data.pieceName, data.oldPos];
    virtualBoard[convertRowsToIndex(data.oldPos[1])][convertColsToIndex(data.oldPos[0])].move();
});
