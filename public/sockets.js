socket.on("playerConnect", (data) => {
    console.log(data.name);
    // console.log(data.sides);
    // if(data.info.pieces) {
    //     pieces = data.info.pieces;
    //     virtualBoard = [
	// 		['','','','','','','',''],
	// 		['','','','','','','',''],
	// 		['','','','','','','',''],
	// 		['','','','','','','',''],
	// 		['','','','','','','',''],
	// 		['','','','','','','',''],
	// 		['','','','','','','',''],
	// 		['','','','','','','','']
	// 	];
    //     for(pieceType in pieces) {
    //         for(piece in pieces[pieceType]) {
    //
    //             row = convertRowsToIndex(piece.coords[1]);
    //             col = convertColsToIndex(piece.coords[0]);
    //
    //             if(pieceType[1] == p) {
    //                 virtualBoard[row][col] == new Pawn(pieceType[0]);
    //             }
    //             // continue with rest of the pieces
    //
    //
    //
    //             virtualBoard[row][col] = new
    //         }
    //     }
    //
    // }
    turn = data.info.turn;
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
  if(data.w == name) {
      side = "w";
  } else if(data.b == name) {
      side = "b";
  } else {
      side = "s";
  }
})
