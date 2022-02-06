class Rook extends Piece {
	constructor(color, coords) {
		super(color, coords);
		this.pieceName = color + "r"
		this.hasMoved = 0;
		if((side == color) || (side == "s" && color == "w")) {
			this.imgurl = "images/ocean_images/ocean_rook.png";
		} else {
			this.imgurl = "images/trash_images/trash_rook.png";
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
		if (this.coords[0] == cellCoord[0] || this.coords[1] == cellCoord[1]) {  // checks if it is in the same row or column
			if(this.blockedHorizontal()) { return }  // if blocked horizontally, do nothing
			if(this.blockedVertical()) { return }  // if blocked vertically, do nothing

			this.movePiece(false);
			this.hasMoved = 1;
			this.checkWinner();
		}
	}

	eat() {
		if (this.coords[0] == cellCoord[0] || this.coords[1] == cellCoord[1]) {  // checks if it is in the same row or column
			if(this.blockedHorizontal()) { return }  // if blocked horizontally, do nothing
			if(this.blockedVertical()) { return }  // if blocked vertically, do nothing

			this.eatPiece();
		}
	}

	canEatKingAt(r, c, myColor) { return this.canEatHV(r, c, myColor) }

	canAvoidCheckmate() {
		var rook_row = convertRowsToIndex(this.coords[1]);
		var rook_col = convertColsToIndex(this.coords[0]);

		// right
		for(var i = rook_col + 1; i<8; i++) {
			if(virtualBoard[rook_row][i] != '' && virtualBoard[rook_row][i].color == this.color) {
				// if test position is occupied by a piece of the same color, break
				break;
			}
			if(this.willKingDie(rook_row, i, rook_row, rook_col) == false) {
				return true;
			}
			if(virtualBoard[rook_row][i] != '' && virtualBoard[rook_row][i].color != this.color) {
				break;
			}
		}

		// left
		for(var i = rook_col - 1; i>=0; i--) {
			if(virtualBoard[rook_row][i] != '' && virtualBoard[rook_row][i].color == this.color) {
				// if test position is occupied by a piece of the same color, break
				break;
			}
			if(this.willKingDie(rook_row, i, rook_row, rook_col) == false) {
				return true;
			}
			if(virtualBoard[rook_row][i] != '' && virtualBoard[rook_row][i].color != this.color) {
				break;
			}
		}

		// up
		for(var i = rook_row - 1; i>=0; i--) {
			if(virtualBoard[i][rook_col] != '' && virtualBoard[i][rook_col].color == this.color) {
				// if test position is occupied by a piece of the same color, break
				break;
			}
			if(this.willKingDie(i, rook_col, rook_row, rook_col) == false) {
				return true;
			}
			if(virtualBoard[i][rook_col] != '' && virtualBoard[i][rook_col].color != this.color) {
				break;
			}
		}

		// down
		for(var i = rook_row + 1; i<8; i++) {
			if(virtualBoard[i][rook_col] != '' && virtualBoard[i][rook_col].color == this.color) {
				// if test position is occupied by a piece of the same color, break
				break;
			}
			if(this.willKingDie(i, rook_col, rook_row, rook_col) == false) {
				return true;
			}
			if(virtualBoard[i][rook_col] != '' && virtualBoard[i][rook_col].color != this.color) {
				break;
			}
		}

		return false;
	}
}
