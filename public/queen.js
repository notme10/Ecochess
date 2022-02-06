class Queen extends Piece {
	constructor(color, coords) {
		super(color, coords);

		this.pieceName = color + "q";
		if((side == color) || (side == "s" && color == "w")) {
			this.imgurl = "images/ocean_images/ocean_queen.png";
		} else {
			this.imgurl = "images/trash_images/trash_queen.png";
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

		if (rowsMoved == colsMoved || this.coords[0] == cellCoord[0] || this.coords[1] == cellCoord[1]) { // bishop + rook logic
			if(rowsMoved == colsMoved && this.blockedDiagonal()) { return }
			if(this.coords[1] == cellCoord[1] && this.blockedHorizontal()) { return }
			if(this.coords[0] == cellCoord[0] && this.blockedVertical()) { return }

			this.movePiece(false);
			this.checkWinner();
		}
	}

	eat() {
		let rowsMoved = Math.abs(convertRowsToIndex(this.coords[1]) - convertRowsToIndex(cellCoord[1]));
		let colsMoved = Math.abs(convertColsToIndex(this.coords[0]) - convertColsToIndex(cellCoord[0]));

		if (rowsMoved == colsMoved || this.coords[0] == cellCoord[0] || this.coords[1] == cellCoord[1]) { // bishop + rook logic
			if(rowsMoved == colsMoved && this.blockedDiagonal()) { return }
			if(this.coords[1] == cellCoord[1] && this.blockedHorizontal()) { return }
			if(this.coords[0] == cellCoord[0] && this.blockedVertical()) { return }

			this.eatPiece();
			this.checkWinner();
		}
	}

	canEatKingAt(r, c, myColor) { return this.canEatHV(r, c, myColor) || this.canEatDiagonals(r, c, myColor) }

	canAvoidCheckmate() {
		var queen_row = convertRowsToIndex(this.coords[1]);
		var queen_col = convertColsToIndex(this.coords[0]);

		// right
		for(var i = queen_row + 1; i<8; i++) {
			if(virtualBoard[queen_row][i] != '' && virtualBoard[queen_row][i].color == this.color) {
				// if test position is occupied by a piece of the same color, break
				break;
			}
			if(this.willKingDie(queen_row, i, queen_row, queen_col) == false) {
				return true;
			}
			if(virtualBoard[queen_row][i] != '' && virtualBoard[queen_row][i].color != this.color) {
				break;
			}
		}

		// left
		for(var i = queen_col - 1; i>=0; i--) {
			if(virtualBoard[queen_row][i] != '' && virtualBoard[queen_row][i].color == this.color) {
				// if test position is occupied by a piece of the same color, break
				break;
			}
			if(this.willKingDie(queen_row, i, queen_row, queen_col) == false) {
				return true;
			}
			if(virtualBoard[queen_row][i] != '' && virtualBoard[queen_row][i].color != this.color) {
				break;
			}
		}

		// up
		for(var i = queen_row - 1; i>=0; i--) {
			if(virtualBoard[i][queen_col] != '' && virtualBoard[i][queen_col].color == this.color) {
				// if test position is occupied by a piece of the same color, break
				break;
			}
			if(this.willKingDie(i, queen_col, queen_row, queen_col) == false) {
				return true;
			}
			if(virtualBoard[i][queen_col] != '' && virtualBoard[i][queen_col].color != this.color) {
				break;
			}
		}

		// down
		for(var i = queen_row + 1; i<8; i++) {
			if(virtualBoard[i][queen_col] != '' && virtualBoard[i][queen_col].color == this.color) {
				// if test position is occupied by a piece of the same color, break
				break;
			}
			if(this.willKingDie(i, queen_col, queen_row, queen_col) == false) {
				return true;
			}
			if(virtualBoard[i][queen_col] != '' && virtualBoard[i][queen_col].color != this.color) {
				break;
			}
		}

		// bottom right
		for(var i = queen_row + 1, j = queen_col + 1; i<8 && j<8; i++, j++) {
			if(virtualBoard[i][j] != '' && virtualBoard[i][j].color == this.color) {
				// if test position is occupied by a piece of the same color, break
				break;
			}
			if(this.willKingDie(i, j, queen_row, queen_col) == false) {
				return true;
			}
			if(virtualBoard[i][j] != '' && virtualBoard[i][j].color != this.color) {
				break;
			}
		}

		// bottom left
		for(var i = queen_row + 1, j = queen_col - 1; i<8 && j>=0; i++, j--) {
			if(virtualBoard[i][j] != '' && virtualBoard[i][j].color == this.color) {
				// if test position is occupied by a piece of the same color, break
				break;
			}
			if(this.willKingDie(i, j, queen_row, queen_col) == false) {
				return true;
			}
			if(virtualBoard[i][j] != '' && virtualBoard[i][j].color != this.color) {
				break;
			}
		}

		// top right
		for(var i = queen_row - 1, j = queen_col + 1; i>=0 && j<8; i--, j++) {
			if(virtualBoard[i][j] != '' && virtualBoard[i][j].color == this.color) {
				// if test position is occupied by a piece of the same color, break
				break;
			}
			if(this.willKingDie(i, j, queen_row, queen_col) == false) {
				return true;
			}
			if(virtualBoard[i][j] != '' && virtualBoard[i][j].color != this.color) {
				break;
			}
		}

		// top left
		for(var i = queen_row - 1, j = queen_col - 1; i>=0 && j>=0; i--, j--) {
			if(virtualBoard[i][j] != '' && virtualBoard[i][j].color == this.color) {
				// if test position is occupied by a piece of the same color, break
				break;
			}
			if(this.willKingDie(i, j, queen_row, queen_col) == false) {
				return true;
			}
			if(virtualBoard[i][j] != '' && virtualBoard[i][j].color != this.color) {
				break;
			}
		}
		return false;
	}

}
