class Pawn extends Piece {
	constructor(color, coords) {
		super(color, coords);
		this.enPassantPossible = false;
		this.pieceName = color + "p";
		if((side == color) || (side == "s" && color == "w")) {
			this.imgurl = "images/ocean_images/ocean_pawn.png";
		} else {
			this.imgurl = "images/trash_images/trash_pawn.png";
		}
	}

	promote(pieceToPromote, rowNow, colNow, prv_coords, captureMove) {
		// console.log(rowNow);
		// console.log(virtualBoard[rowNow]);
		switch(pieceToPromote) {

			// promote to queen
			case "q":
			virtualBoard[rowNow][colNow] = new Queen(this.color, cellCoord);
			moveList.push({pieceName: this.pieceName,
				oldPos: prv_coords,
				newPos: this.coords,
				color: this.color,
				captured: captureMove,
				threatened: this.checkedOrCheckmated(),
				display: `${this.pieceName}.${prv_coords}.${this.coords}=q`
			});
			break;

			// promote to bishop
			case "b":
			virtualBoard[rowNow][colNow] = new Bishop(this.color, cellCoord);
			moveList.push({pieceName: this.pieceName,
				oldPos: prv_coords,
				newPos: this.coords,
				color: this.color,
				captured: captureMove,
				threatened: this.checkedOrCheckmated(),
				display: `${this.pieceName}.${prv_coords}.${this.coords}=b`
			});
			break;

			// promote to rook
			case "r":
			virtualBoard[rowNow][colNow] = new Rook(this.color, cellCoord);
			moveList.push({pieceName: this.pieceName,
				oldPos: prv_coords,
				newPos: this.coords,
				color: this.color,
				captured: captureMove,
				threatened: this.checkedOrCheckmated(),
				display: `${this.pieceName}.${prv_coords}.${this.coords}=r`
			});
			break;

			// promote to knight
			case "n":
			virtualBoard[rowNow][colNow] = new Knight(this.color, cellCoord);
			moveList.push({pieceName: this.pieceName,
				oldPos: prv_coords,
				newPos: this.coords,
				color: this.color,
				captured: captureMove,
				threatened: this.checkedOrCheckmated(),
				display: `${this.pieceName}.${prv_coords}.${this.coords}=n`
			});
			break;
		}
		pushMoveMessage();

		var p = document.createElement('div'); // makes a new div called p
		let pieceName = this.color + pieceToPromote;
		p.className = `${pieceName} ${cellCoord} ${pieceIdentifier(side, pieceName)}`; // creates promoted piece
		document.getElementById(cellCoord).appendChild(p); // puts the piece we created in js into the cell that we clicked on

		this.endTurn(prv_coords, captureMove);
	}

	setEverything(color, coords, hasMoved, pinned, imgurl, enPassantPossible, pieceName) {
		this.color = color;
		this.coords = coords;
		this.hasMoved = hasMoved;
		this.pinned = pinned;
		this.imgurl = imgurl;
		this.enPassantPossible = enPassantPossible;
		this.pieceName = pieceName;
	}

	move() {
		let rowsMoved = convertRowsToIndex(this.coords[1]) - convertRowsToIndex(cellCoord[1]);
		let colsMoved = convertColsToIndex(this.coords[0]) - convertColsToIndex(cellCoord[0]);

		// PAWN DOUBLE MOVE
		if ((this.color == "w") && (rowsMoved == 1) && (colsMoved == 0) ||
		(this.color == "b") && (rowsMoved == -1) && (colsMoved == 0) ||
		(this.color == "w") && (this.coords[1] == "2") && (rowsMoved == 2) && (colsMoved == 0) ||
		(this.color == "b") && (this.coords[1] == "7") && (rowsMoved == -2) && (colsMoved == 0)) {

			this.movePiece(false);

			// CHECK IF EN PASSANT IS POSSIBLE FOR WHITE

			if(this.color == "b" && cellCoord[1] == "5") {
				if(convertColsToIndex(cellCoord[0]) >= 1) {
					var leftPiece = virtualBoard[3][convertColsToIndex(cellCoord[0])-1];
					if(leftPiece !== '' && leftPiece.pieceName == "wp") {
						leftPiece.enPassantPossible = true;
					}
				}

				if(convertColsToIndex(cellCoord[0]) <= 6) {
					var rightPiece = virtualBoard[3][convertColsToIndex(cellCoord[0])+1];
					if(rightPiece !== '' && rightPiece.pieceName == "wp") {
						rightPiece.enPassantPossible = true;
					}
				}
			}

			// CHECK IF EN PASSANT IS POSSIBLE FOR BLACK

			if(this.color == "w" && cellCoord[1] == "4") {
				if(convertColsToIndex(cellCoord[0]) >= 1) {
					var leftPiece = virtualBoard[4][convertColsToIndex(cellCoord[0])-1];
					if(leftPiece !== '' && leftPiece.pieceName == "bp") {
						leftPiece.enPassantPossible = true;
					}
				}

				if(convertColsToIndex(cellCoord[0]) <= 6) {
					var rightPiece = virtualBoard[4][convertColsToIndex(cellCoord[0])+1];
					if(rightPiece !== '' && rightPiece.pieceName == "bp") {
						rightPiece.enPassantPossible = true;
					}
				}
			}
			return;
		}

		// EN PASSANT - WHITE
		if(this.color == "w" && this.coords[1] == "5" && this.enPassantPossible == true) {

			var prv_coords = this.coords;
			var Y = parseInt(convertRowsToIndex(this.coords[1]));
			var X = parseInt(convertColsToIndex(this.coords[0]));

			if(((X-1) > 0) && (convertColsToIndex(cellCoord[0]) == (X-1))) {
				if(virtualBoard[Y][X-1].pieceName == "bp") {
					this.movePiece(false);

					// console.log("condition 1");
					// moveList.push({pieceName: this.pieceName,
					// 	oldPos: prv_coords,
					// 	newPos: this.coords,
					// 	color: this.color,
					// 	captured: true,
					// 	threatened: this.checkedOrCheckmated(),
					// 	display: `${this.pieceName}.${prv_coords}.${this.coords}`
					// });
					// pushMoveMessage();

					virtualBoard[Y][X-1] = ''; // old virt space is set back to ''

					var capturedPieceInfo = convertIndexToCols(X-1) + (convertIndexToRows(Y)).toString()
					document.querySelector(`.${"bp"}.${capturedPieceInfo}`).remove(); // removes piece from old square
				}
			}

			else if(((X+1) < 7) && (convertColsToIndex(cellCoord[0]) == (X+1))) {
				if(virtualBoard[Y][X+1].pieceName == "bp") {
					this.movePiece(false);
					console.log("condition dos");
					// moveList.push({pieceName: this.pieceName,
					// 	oldPos: prv_coords,
					// 	newPos: this.coords,
					// 	color: this.color,
					// 	captured: true,
					// 	threatened: this.checkedOrCheckmated(),
					// 	display: `${this.pieceName}.${prv_coords}.${this.coords}`
					// });
					// pushMoveMessage();

					virtualBoard[Y][X+1] = ''; // old virt space is set back to ''

					var capturedPieceInfo = convertIndexToCols(X+1) + (convertIndexToRows(Y)).toString()
					document.querySelector(`.${"bp"}.${capturedPieceInfo}`).remove(); // removes piece from old square
				}
			}
		}

		// EN PASSANT - BLACK
		else if (this.color == "b" && this.coords[1] == "4" && this.enPassantPossible == true) {
			var prv_coords = this.coords;
			var Y = parseInt(convertRowsToIndex(this.coords[1]));
			var X = parseInt(convertColsToIndex(this.coords[0]));

			if((X-1) > 0) {
				if(virtualBoard[Y][X-1].pieceName == "wp") {
					this.movePiece(false);

					// moveList.push({pieceName: this.pieceName,
					// 	oldPos: prv_coords,
					// 	newPos: this.coords,
					// 	color: this.color,
					// 	captured: true,
					// 	threatened: this.checkedOrCheckmated(),
					// 	display: `${this.pieceName}.${prv_coords}.${this.coords}`
					// });
					// pushMoveMessage();

					virtualBoard[Y][X-1] = ''; // old virt space is set back to ''

					var capturedPieceInfo = convertIndexToCols(X-1) + (convertIndexToRows(Y)).toString()
					document.querySelector(`.${"wp"}.${capturedPieceInfo}`).remove(); // removes piece from old square
				}
			}

			else if((X+1) < 7) {
				if(virtualBoard[Y][X+1].pieceName == "wp") {
					this.movePiece(false);

					// moveList.push({pieceName: this.pieceName,
					// 	oldPos: prv_coords,
					// 	newPos: this.coords,
					// 	color: this.color,
					// 	captured: true,
					// 	threatened: this.checkedOrCheckmated(),
					// 	display: `${this.pieceName}.${prv_coords}.${this.coords}`
					// });
					// pushMoveMessage();

					virtualBoard[Y][X+1] = ''; // old virt space is set back to ''

					var capturedPieceInfo = convertIndexToCols(X+1) + (convertIndexToRows(Y)).toString()
					document.querySelector(`.${"wp"}.${capturedPieceInfo}`).remove(); // removes piece from old square
				}
			}
		}
		this.checkWinner();
	}

	eat() {
		let rowsMoved = convertRowsToIndex(this.coords[1]) - convertRowsToIndex(cellCoord[1]);
		let colsMoved = convertColsToIndex(this.coords[0]) - convertColsToIndex(cellCoord[0]);

		if(this.color == "w" && rowsMoved == 1 && (colsMoved == 1 || colsMoved == -1)) {
			this.eatPiece();
		}

		if(this.color == "b" && rowsMoved == -1 && (colsMoved == 1 || colsMoved == -1)) {
			this.eatPiece();
		}
	}

	canEatKingAt(r, c, myColor) {

		let cur_r = convertRowsToIndex(this.coords[1]);
		let cur_c = convertColsToIndex(this.coords[0]);

		if(myColor !== this.color) {
			if(this.color == "b" && cur_r + 1 == r) {
				// for black pawn
				if(cur_c + 1 == c) { return this }
				if(cur_c - 1 == c) { return this }
			}
			if(this.color == "w" && cur_r - 1 == r) {
				// for white pawn
				if(cur_c + 1 == c) { return this }
				if(cur_c - 1 == c) { return this }
			}
		}
	}

	canAvoidCheckmate() {
		var pawn_row = convertRowsToIndex(this.coords[1]);
		var pawn_cols = convertColsToIndex(this.coords[0]);

		if(this.color == "w") {
			// white
			if((pawn_row < 7) && (virtualBoard[pawn_row + 1][pawn_cols] == '' || virtualBoard[pawn_row + 1][pawn_cols].color !== this.color)) {
				// if pawn_row + 1 does not go over 8 and if the piece in front of pawn is not empty or is a different color

				if(this.willKingDie(pawn_row+1, pawn_cols, pawn_row, pawn_cols) == false) {
					return true;
				}
			}
			if((pawn_row == 1) && (virtualBoard[pawn_row + 2][pawn_cols] == '' || virtualBoard[pawn_row + 2][pawn_cols].color !== this.color)) {
				// if pawn_row + 1 does not go over 8 and if the piece in front of pawn is not empty or is a different color
				if(this.willKingDie(pawn_row+2, pawn_cols, pawn_row, pawn_cols) == false) {
					return true;
				}
			}
		} else {
			// black
			if((pawn_row > 0) && (virtualBoard[pawn_row - 1][pawn_cols] == '' || virtualBoard[pawn_row - 1][pawn_cols].color !== this.color)) {
				// if pawn_row + 1 does not go over 8 and if the piece in front of pawn is not empty or is a different color
				if(this.willKingDie(pawn_row-1, pawn_cols, pawn_row, pawn_cols) == false) {
					return true;
				}
			}
			if((pawn_row == 6) && (virtualBoard[pawn_row - 2][pawn_cols] == '' || virtualBoard[pawn_row - 2][pawn_cols].color !== this.color)) {
				// if pawn_row + 1 does not go over 8 and if the piece in front of pawn is not empty or is a different color
				if(this.willKingDie(pawn_row-2, pawn_cols, pawn_row, pawn_cols) == false) {
					return true;
				}
			}
		}
		return false;
	}
}
