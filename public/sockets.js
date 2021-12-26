
socket.on("playerConnect", (data) => {
    if(data.info.pieces && turn == 0) {
      //convert objects in pieces from server into classes
        pieces = data.info.pieces;
        virtualBoard = [
            ['','','','','','','',''],
            ['','','','','','','',''],
            ['','','','','','','',''],
            ['','','','','','','',''],
            ['','','','','','','',''],
            ['','','','','','','',''],
            ['','','','','','','',''],
            ['','','','','','','','']
        ];
        var result = {};
        for(pieceType in pieces) {
          result[pieceType] = [];
            for(i in pieces[pieceType]) {
                piece = pieces[pieceType][i]
                var pieceTypeArray = result[pieceType]
                row = convertRowsToIndex(piece.coords[1]);
                col = convertColsToIndex(piece.coords[0]);

                if(pieceType[1] == "p") {
                  var createdPiece = new Pawn(pieceType[0]);
                  createdPiece.setEverything(piece.color, piece.coords, piece.hasMoved, piece.pinned, piece.imgurl, piece.enPassantPossible, piece.pieceName);
                  pieceTypeArray.push(createdPiece);
                  virtualBoard[row][col] = createdPiece;
                    // virtualBoard[row][col].setEverything(piece.color, piece.coords, piece.hasMoved, piece.pinned, piece.imgurl, piece.enPassantPossible, piece.pieceName);
                }
                else if(pieceType[1] == "r") {
                  var createdPiece = new Rook(pieceType[0]);
                  createdPiece.setEverything(piece.color, piece.coords, piece.hasMoved, piece.pinned, piece.imgurl, piece.pieceName);
                  pieceTypeArray.push(createdPiece);
                  virtualBoard[row][col] = createdPiece;
                }
                else if(pieceType[1] == "n") {
                  var createdPiece = new Knight(pieceType[0]);
                  createdPiece.setEverything(piece.color, piece.coords, piece.hasMoved, piece.pinned, piece.imgurl, piece.pieceName);
                  pieceTypeArray.push(createdPiece);
                  virtualBoard[row][col] = createdPiece;
                }
                else if(pieceType[1] == "b") {
                  var createdPiece = new Bishop(pieceType[0]);
                  createdPiece.setEverything(piece.color, piece.coords, piece.hasMoved, piece.pinned, piece.imgurl, piece.pieceName);
                  pieceTypeArray.push(createdPiece);
                  virtualBoard[row][col] = createdPiece;
                }
                else if(pieceType[1] == "q") {
                  var createdPiece = new Queen(pieceType[0]);
                  createdPiece.setEverything(piece.color, piece.coords, piece.hasMoved, piece.pinned, piece.imgurl, piece.pieceName);
                  pieceTypeArray.push(createdPiece);
                  virtualBoard[row][col] = createdPiece;
                }
                else if(pieceType[1] == "k") {
                  var createdPiece = new King(pieceType[0]);
                  createdPiece.setEverything(piece.color, piece.coords, piece.hasMoved, piece.pinned, piece.imgurl, piece.pieceName);
                  pieceTypeArray.push(createdPiece);
                  virtualBoard[row][col] = createdPiece;
                }
            }
        }
        pieces = result;

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                cell = document.getElementById(columns[j] + rows[i])
                cell.innerHTML = ""
                if (virtualBoard[i][j]) {
                    p = document.createElement('div'); // creates a piece
                    p.className = `${virtualBoard[i][j].pieceName} ${columns[j] + rows[i]}`; // p.className = 'br a8'
                    cell.appendChild(p);
                }
            }
        }
        for(var i = 0; i<data.info.moveList.length; i++) {
            moveList.push(data.info.moveList[i]);
                pushMoveMessage();
        }
    }
    turn = data.info.turn;
});

socket.on("sendMove", (data) => {
    if (data.room == room) {
        // console.log(data.moves);
        cellCoord = data.moves.newPos.substring(0, 2);
        pieceInfo = [data.moves.pieceName, data.moves.oldPos];

        // if(virtualBoard[convertRowsToIndex(cellCoord[0])][convertColsToIndex(cellCoord[1])]) {
        //
        // }
        console.log(data);
        if (virtualBoard[convertRowsToIndex(data.moves.oldPos[1])][convertColsToIndex(data.moves.oldPos[0])]) {
            // console.log(data);
            // console.log(cellCoord);
            // console.log(pieceInfo);

            if(virtualBoard[convertRowsToIndex(cellCoord[1])][convertColsToIndex(cellCoord[0])]) {
                virtualBoard[convertRowsToIndex(data.moves.oldPos[1])][convertColsToIndex(data.moves.oldPos[0])].eat();
                // console.log("EAT!");
            } else {
                virtualBoard[convertRowsToIndex(data.moves.oldPos[1])][convertColsToIndex(data.moves.oldPos[0])].move();
                // console.log("MOVE!");
            }
        }
    }
});

socket.on("sidesInfo", (data) => {
    if(data.w == name && side !== "w") {
        side = "w";
        board.innerHTML = '';
        generateBoard(side);
    } else if(data.b == name && side !== "b") {
        side = "b";
        board.innerHTML = '';
        generateBoard(side);
    } else if(side !== "w" && side !== "b") {
        side = "s";
    }



})
