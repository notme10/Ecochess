socket.on("playerConnect", (data) => {
    console.log(data.name);
    // console.log(data.sides);
});

socket.on("sendMove", (data) => {
  if (data.room == room) {
    console.log(data.moves);
    cellCoord = data.moves.newPos;
    pieceInfo = [data.moves.pieceName, data.moves.oldPos];
    if (virtualBoard[convertRowsToIndex(data.moves.oldPos[1])][convertColsToIndex(data.moves.oldPos[0])]) {
      virtualBoard[convertRowsToIndex(data.moves.oldPos[1])][convertColsToIndex(data.moves.oldPos[0])].move();
    }
  }

});

socket.on("sidesInfo", (data) => {
  console.log(data);
})
