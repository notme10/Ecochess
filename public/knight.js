class Knight extends Piece {
	constructor(color, coords) {
		super(color, coords);
		this.pieceName = color + "n";
		if((side == color) || (side == "s" && color == "w")) {
			this.imgurl = "images/ocean_images/ocean_knight.png";
		} else {
			this.imgurl = "images/trash_images/trash_knight.png";
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

		if ((rowsMoved == 2 && colsMoved == 1) || (rowsMoved == 1 && colsMoved == 2)) {
			this.movePiece(false);
			this.checkWinner();
		}
	}

	eat() {
		let rowsMoved = Math.abs(convertRowsToIndex(this.coords[1]) - convertRowsToIndex(cellCoord[1]));
		let colsMoved = Math.abs(convertColsToIndex(this.coords[0]) - convertColsToIndex(cellCoord[0]));

		if ((rowsMoved == 2 && colsMoved == 1) || (rowsMoved == 1 && colsMoved == 2)) { this.eatPiece() }
	}

	canEatKingAt(r, c, myColor) {
		// knight checking
		let cur_r = convertRowsToIndex(this.coords[1])
		let cur_c = convertColsToIndex(this.coords[0])
		var test_c;
		var test_r;

		// right 2 up 1
		test_c = cur_c + 2;
		test_r = cur_r - 1;
		if(test_r >= 0 && test_c <= 7) {
			if(test_c == c && test_r == r && this.color !== myColor) {
				return true;
			}
		}

		// right 1 up 2
		test_c = cur_c + 1;
		test_r = cur_r - 2;
		if(test_r >= 0 && test_c <= 7) {
			if(test_c == c && test_r == r && this.color !== myColor) {
				return true;
			}
		}

		// left 1 up 2
		test_c = cur_c - 1;
		test_r = cur_r - 2;
		if(test_r >= 0 && test_c <= 7) {
			if(test_c == c && test_r == r && this.color !== myColor) {
				return true;
			}
		}

		// left 2 up 1
		test_c = cur_c - 2;
		test_r = cur_r - 1;
		if(test_r >= 0 && test_c <= 7) {
			if(test_c == c && test_r == r && this.color !== myColor) {
				return true;
			}
		}

		// left 2 down 1
		test_c = cur_c - 2;
		test_r = cur_r + 1;
		if(test_r >= 0 && test_c <= 7) {
			if(test_c == c && test_r == r && this.color !== myColor) {
				return true;
			}
		}

		// left 1 down 2
		test_c = cur_c - 1;
		test_r = cur_r + 2;
		if(test_r >= 0 && test_c <= 7) {
			if(test_c == c && test_r == r && this.color !== myColor) {
				return true;
			}
		}

		// right 1 down 2
		test_c = cur_c + 1;
		test_r = cur_r + 2;
		if(test_r >= 0 && test_c <= 7) {
			if(test_c == c && test_r == r && this.color !== myColor) {
				return true;
			}
		}

		// right 2 down 1
		test_c = cur_c + 2;
		test_r = cur_r - 1;
		if(test_r >= 0 && test_c <= 7) {
			if(test_c == c && test_r == r && this.color !== myColor) {
				return true;
			}
		}
		return false;
	}

	canAvoidCheckmate() {

		var knight_row = convertRowsToIndex(this.coords[1]);
		var knight_col = convertColsToIndex(this.coords[0]);

		const possible_knight_moves = [[2,1], [-2,1], [-2,-1], [1,2], [1,-2],[2,-1], [-1,2],[-1,-2]];

		var resultList = possible_knight_moves.map(move => {
			var test_row = knight_row + move[0];
			var test_col = knight_col + move[1];
			if((test_row >= 0) && (test_row < 8) && (test_col >= 0) && (test_col < 8) ) {
				if(virtualBoard[test_row][test_col] != '' && virtualBoard[test_row][test_col].color == this.color) {
					return false;
				}
				// if test position is occupied by a piece of the same color, break
				if(this.willKingDie(test_row, test_col, knight_row, knight_col) == false) {
					return true;
				}

			}
			return false;
		}
	);

	for(var i = 0; i<8; i++) {
		if(resultList[i] == true) {
			return true;
		}
	}
	return false;
}
}
