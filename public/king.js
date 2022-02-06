class King extends Piece {
	constructor(color, coords) {
		super(color, coords);

		this.pieceName = color + "k";
		this.hasMoved = false;
		if((side == color) || (side == "s" && color == "w")) {
			this.imgurl = "images/ocean_images/ocean_king.png";
		} else {
			this.imgurl = "images/trash_images/trash_king.png";
		}
	}
	setEverything(color, coords, hasMoved, pinned, imgurl, pieceName) {
		this.color = color;
		this.coords = coords;
		this.hasMoved = hasMoved;
		this.pinned = pinned;
		this.imgurl = imgurl;
		this.pieceName = pieceName;
	}
	eat() {
		let rowsMoved = Math.abs(convertRowsToIndex(this.coords[1]) - convertRowsToIndex(cellCoord[1]));
		let colsMoved = Math.abs(convertColsToIndex(this.coords[0]) - convertColsToIndex(cellCoord[0]));

		if (rowsMoved <= 1 && colsMoved <= 1) {
			this.eatPiece()
		}
	}

	potentialThreatChecker(potentialThreat, pieceType) {
		var oppColor = this.color=="w" ? "b" : "w";

		if(potentialThreat) {
			if(potentialThreat.color == oppColor && potentialThreat.pieceName[1] == pieceType) { return 1 }
			return 0;
		}
		else {
			return 0;
		}
	}

	canEatKingAt(r, c, myColor) {
		let cur_r = convertRowsToIndex(this.coords[1])
		let cur_c = convertColsToIndex(this.coords[0])

		if(cur_r + 1 == r && this.color !== myColor) {
			if(cur_c == c) { return this }
			if(cur_c + 1 == c) { return this }
			if(cur_c - 1 == c) { return this }
		} else if(cur_r==r && this.color !== myColor) {
			if(cur_c + 1 == c) { return this }
			if(cur_c - 1 == c) { return this }
		} else if(cur_r - 1 == r && this.color !== myColor) {
			if(cur_c == c) { return this }
			if(cur_c + 1 == c) { return this }
			if(cur_c - 1 == c) { return this }
		}
		return false;
	}

	move() {
		var cur_x = convertColsToIndex(this.coords[0]);
		var cur_y = convertRowsToIndex(this.coords[1]);
		var isThreatened = this.isKingChecked(cur_y, cur_x, this.color);
		let rowsMoved = Math.abs(cur_y - convertRowsToIndex(cellCoord[1]));
		let colsMoved = Math.abs(cur_x - convertColsToIndex(cellCoord[0]));

		if (rowsMoved <= 1 && colsMoved <= 1) {
			this.movePiece(false);
			this.hasMoved = true;
		}

		if(isThreatened == false) {
			// castling for white king
			if(cur_y == 7 && this.color == 'w') {
				if(convertColsToIndex(cellCoord[0]) == 6 && rowsMoved == 0) {
					if(virtualBoard[7][5] == '' && virtualBoard[7][6] == '' && virtualBoard[7][7].pieceName == "wr") {
						if(this.hasMoved == false) {
							if(this.isKingChecked("7", "6", "w") == false) {

								moveList.push({pieceName: this.pieceName,
									oldPos: this.coords,
									newPos: cellCoord,
									color: this.color,
									captured: false,
									threatened: false,
									display: "0-0"
								});

								pushMoveMessage();

								this.movePiece(false);
								virtualBoard[7][5] = virtualBoard[7][7]; // move rook to new location
								virtualBoard[7][7] = ''; // delete old rook

								virtualBoard[7][5].coords = "f1";
								document.querySelector(`.${"wr"}.${"h1"}`).remove(); // removes piece from old square
								var p = document.createElement('div'); // makes a new div called p
								p.className = `${"wr"} ${"f1"}`; // puts the first part of pieceInfo and the cellCoord into the p's className
								document.getElementById("f1").appendChild(p); // puts the piece we created in js into the cell that we clicked on
							}
						}
					}
				}

				if(convertColsToIndex(cellCoord[0]) == 1 && rowsMoved == 0) {
					if(virtualBoard[7][1] == '' && virtualBoard[7][2] == '' && virtualBoard[7][3] == '' && virtualBoard[7][0].pieceName == "wr") {
						if(this.hasMoved == false) {
							if(this.isKingChecked("7", "1", "w") == false) {
								// moveList.push("wk castled queen side on turn " + (turn+1));

								moveList.push({pieceName: this.pieceName,
									oldPos: this.coords,
									newPos: cellCoord,
									color: this.color,
									captured: false,
									threatened: false,
									display: "0-0-0"
								});


								pushMoveMessage();
								this.movePiece(false);
								virtualBoard[7][2] = virtualBoard[7][0]; // move rook to new location
								virtualBoard[7][0] = ''; // delete old rook

								virtualBoard[7][2].coords = "c1";
								document.querySelector(`.${"wr"}.${"a1"}`).remove(); // removes piece from old square
								var p = document.createElement('div'); // makes a new div called p
								p.className = `${"wr"} ${"c1"}`; // puts the first part of pieceInfo and the cellCoord into the p's className
								document.getElementById("c1").appendChild(p); // puts the piece we created in js into the cell that we clicked on
							}
						}
					}
				}
			}

			// castling for the black king
			if(cur_y == 0 && this.color == 'b') {
				if(convertColsToIndex(cellCoord[0]) == 6 && rowsMoved == 0) {
					if(virtualBoard[0][5] == '' && virtualBoard[0][6] == '' && virtualBoard[0][7].pieceName == "br") {
						if(this.hasMoved == false) {
							if(this.isKingChecked("0", "6", "b") == false) {

								moveList.push({pieceName: this.pieceName,
									oldPos: this.coords,
									newPos: cellCoord,
									color: this.color,
									captured: false,
									threatened: false,
									display: "0-0"
								});

								pushMoveMessage();

								this.movePiece(false);
								virtualBoard[0][5] = virtualBoard[0][7]; // move rook to new location
								virtualBoard[0][7] = ''; // delete old rook

								virtualBoard[0][5].coords = "f8";
								document.querySelector(`.${"br"}.${"h8"}`).remove(); // removes piece from old square
								var p = document.createElement('div'); // makes a new div called p
								p.className = `${"br"} ${"f8"}`; // puts the first part of pieceInfo and the cellCoord into the p's className
								document.getElementById("f8").appendChild(p); // puts the piece we created in js into the cell that we clicked on
							}
						}
					}
				}

				if(convertColsToIndex(cellCoord[0]) == 1 && rowsMoved == 0) {
					if(virtualBoard[0][1] == '' && virtualBoard[0][2] == '' && virtualBoard[0][3] == '' && virtualBoard[0][0].pieceName == "br") {
						if(this.hasMoved == false) {
							if(this.isKingChecked("0", "1", "b") == false) {

								moveList.push({pieceName: this.pieceName,
									oldPos: this.coords,
									newPos: cellCoord,
									color: this.color,
									captured: false,
									threatened: false,
									display: "0-0-0"
								});

								pushMoveMessage();
								this.movePiece(false);
								virtualBoard[0][2] = virtualBoard[0][0]; // move rook to new location
								virtualBoard[0][0] = ''; // delete old rook

								virtualBoard[0][2].coords = "c8";
								document.querySelector(`.${"br"}.${"a8"}`).remove(); // removes piece from old square
								var p = document.createElement('div'); // makes a new div called p
								p.className = `${"br"} ${"c8"}`; // puts the first part of pieceInfo and the cellCoord into the p's className
								document.getElementById("c8").appendChild(p); // puts the piece we created in js into the cell that we clicked on
							}
						}
					}
				}
			}
		}
		this.checkWinner();
	}

	canAvoidCheckmate() {
		// checks eight squares around King and moves king to each one temporarily
		// checks if king is out of check at that spot
		// returns true if king can get out of check
		// return false if king is in checkmate

		var king_x = convertRowsToIndex(this.coords[1]);
		var king_y = convertColsToIndex(this.coords[0]);

		for(var i = king_x - 1; i <= king_x + 1; i++) {
			for(var j = king_y - 1; j <= king_y + 1; j++) {
				if(i > 7 || i < 0 || j > 7 || j < 0) {
				}
				else if([i, j] !== [king_x, king_y] && virtualBoard[i][j].color == this.color) {
				}
				else if(this.willKingDie(i, j, king_x, king_y) == false) {
					return true;
				}
			}
		}
		return false;
	}

	isCheckmated() {

		var king_x = convertRowsToIndex(this.coords[1]);
		var king_y = convertColsToIndex(this.coords[0]);

		if (!this.isKingChecked(king_x, king_y, this.color)) {
			return false;
		}

		// check if pieces are pinned

		var kingsPieces = Object.entries(pieces).filter(entry => (entry[0][0] == this.color) && (entry[0] !== this.color + "k")).flat().filter(item => typeof item !== "string").flat();

		for(var i = 0; i<8; i++) {
			for (var j = 0; j<8; j++) {
				if(virtualBoard[i][j] !== '' && virtualBoard[i][j].color == this.color) {
					if(virtualBoard[i][j].canAvoidCheckmate() == true) {
						return false;
					}
				}
			}
		}

		return true;
	}
}
