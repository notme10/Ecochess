class Bishop extends Piece {
	constructor(color, coords) {
		super(color, coords);

		this.pieceName = color + "b";
		if((side == color) || (side == "s" && color == "w")) {
			this.imgurl = "images/ocean_images/ocean_bishop.png";
		} else {
			this.imgurl = "images/trash_images/trash_bishop.png";
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
	move() {
		let rowsMoved = Math.abs(convertRowsToIndex(this.coords[1]) - convertRowsToIndex(cellCoord[1]));
		let colsMoved = Math.abs(convertColsToIndex(this.coords[0]) - convertColsToIndex(cellCoord[0]));

		if (rowsMoved == colsMoved) {
			if(this.blockedDiagonal()) { return }
			this.movePiece(false);
			this.checkWinner();
		}

	}

	eat() {
		let rowsMoved = Math.abs(convertRowsToIndex(this.coords[1]) - convertRowsToIndex(cellCoord[1]));
		let colsMoved = Math.abs(convertColsToIndex(this.coords[0]) - convertColsToIndex(cellCoord[0]));

		if (rowsMoved == colsMoved) {
			if(this.blockedDiagonal()) { return }
			this.eatPiece();
		}
	}

	canEatKingAt(r, c, myColor) { return this.canEatDiagonals(r, c, myColor) }

	canAvoidCheckmate() {
		var bishop_r = convertRowsToIndex(this.coords[1]);
		var bishop_c = convertColsToIndex(this.coords[0]);

		// bottom right
		for(var i = bishop_r + 1, j = bishop_c + 1; i<8 && j<8; i++, j++) {
			if(virtualBoard[i][j] != '' && virtualBoard[i][j].color == this.color) {
				// if test position is occupied by a piece of the same color, break
				break;
			}
			if(this.willKingDie(i, j, bishop_r, bishop_c) == false) {
				return true;
			}
			if(virtualBoard[i][j] != '' && virtualBoard[i][j].color != this.color) {
				break;
			}
		}

		// bottom left
		for(var i = bishop_r + 1, j = bishop_c - 1; i<8 && j>=0; i++, j--) {
			if(virtualBoard[i][j] != '' && virtualBoard[i][j].color == this.color) {
				// if test position is occupied by a piece of the same color, break
				break;
			}
			if(this.willKingDie(i, j, bishop_r, bishop_c) == false) {
				return true;
			}
			if(virtualBoard[i][j] != '' && virtualBoard[i][j].color != this.color) {
				break;
			}
		}

		// top right
		for(var i = bishop_r - 1, j = bishop_c + 1; i>=0 && j<8; i--, j++) {
			if(virtualBoard[i][j] != '' && virtualBoard[i][j].color == this.color) {
				// if test position is occupied by a piece of the same color, break
				break;
			}
			if(this.willKingDie(i, j, bishop_r, bishop_c) == false) {
				return true;
			}
			if(virtualBoard[i][j] != '' && virtualBoard[i][j].color != this.color) {
				break;
			}
		}

		// top left
		for(var i = bishop_r - 1, j = bishop_c - 1; i>=0 && j>=0; i--, j--) {
			if(virtualBoard[i][j] != '' && virtualBoard[i][j].color == this.color) {
				// if test position is occupied by a piece of the same color, break
				break;
			}
			if(this.willKingDie(i, j, bishop_r, bishop_c) == false) {
				return true;
			}
			if(virtualBoard[i][j] != '' && virtualBoard[i][j].color != this.color) {
				break;
			}
		}
		return false;
	}
}
