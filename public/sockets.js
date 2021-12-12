socket.on("playerConnect", (data) => {
    console.log(data.name);
    console.log(data.sides);
    if(data.info.pieces && turn == 0) {
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
        for(pieceType in pieces) {
            for(i in pieces[pieceType]) {
                piece = pieces[pieceType][i]
                row = convertRowsToIndex(piece.coords[1]);
                col = convertColsToIndex(piece.coords[0]);

                if(pieceType[1] == "p") {
                    virtualBoard[row][col] = new Pawn(pieceType[0]);
                    virtualBoard[row][col].setEverything(piece.color, piece.coords, piece.hasMoved, piece.pinned, piece.imgurl, piece.enPassantPossible, piece.pieceName);
                }
                else if(pieceType[1] == "r") {
                    virtualBoard[row][col] = new Rook(pieceType[0]);
                    virtualBoard[row][col].setEverything(piece.color, piece.coords, piece.hasMoved, piece.pinned, piece.imgurl, piece.pieceName);
                }
                else if(pieceType[1] == "n") {
                    virtualBoard[row][col] = new Knight(pieceType[0]);
                    virtualBoard[row][col].setEverything(piece.color, piece.coords, piece.hasMoved, piece.pinned, piece.imgurl, piece.pieceName);
                }
                else if(pieceType[1] == "b") {
                    virtualBoard[row][col] = new Bishop(pieceType[0]);
                    virtualBoard[row][col].setEverything(piece.color, piece.coords, piece.hasMoved, piece.pinned, piece.imgurl, piece.pieceName);
                }
                else if(pieceType[1] == "q") {
                    virtualBoard[row][col] = new Queen(pieceType[0]);
                    virtualBoard[row][col].setEverything(piece.color, piece.coords, piece.hasMoved, piece.pinned, piece.imgurl, piece.pieceName);
                }
                else if(pieceType[1] == "k") {
                    virtualBoard[row][col] = new King(pieceType[0]);
                    virtualBoard[row][col].setEverything(piece.color, piece.coords, piece.hasMoved, piece.pinned, piece.imgurl, piece.pieceName);
                }
            }
        }

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
        cellCoord = data.moves.newPos;
        pieceInfo = [data.moves.pieceName, data.moves.oldPos];

        // if(virtualBoard[convertRowsToIndex(cellCoord[0])][convertColsToIndex(cellCoord[1])]) {
        //
        // }

        if (virtualBoard[convertRowsToIndex(data.moves.oldPos[1])][convertColsToIndex(data.moves.oldPos[0])]) {
            console.log(data);
            console.log(cellCoord);
            console.log(pieceInfo);

            if(virtualBoard[convertRowsToIndex(cellCoord[1])][convertColsToIndex(cellCoord[0])]) {
                virtualBoard[convertRowsToIndex(data.moves.oldPos[1])][convertColsToIndex(data.moves.oldPos[0])].eat();
                console.log("EAT!");
            } else {
                virtualBoard[convertRowsToIndex(data.moves.oldPos[1])][convertColsToIndex(data.moves.oldPos[0])].move();
                console.log("MOVE!");
            }
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
