/*

IMPORTNANT STUFF TO DO!!!

1.	figure out myColor stuff
2.	figure out why i cant go diagonally after clicking into a place thats checked
3. 	king can eat piece, even if that piece is "protected"
4.  finish checkmate

*/

class Piece {
	constructor(color) {
		this.color = color;
		this.coords;
	}

	setCoord(coord) {
		this.coords = coord;
	}

	movePiece() {
		this.coords = cellCoord;

		let rowPrevious = rows.indexOf(pieceInfo[1][1]); // get the row of previous position
		let colPrevious = columns.indexOf(pieceInfo[1][0]); // get the column of previous position
		let rowNow = rows.indexOf(cellCoord[1]); // get row of current position
		let colNow = columns.indexOf(cellCoord[0]); // get column of current position
		let selectedCell = document.querySelector(".selected") // get in formation about the cell that is selected

		virtualBoard[rowNow][colNow] = virtualBoard[rowPrevious][colPrevious]; // new virtual space = old virt space
		virtualBoard[rowPrevious][colPrevious] = ''; // old virt space is set back to ''

		if (selectedCell) {
			selectedCell.className = selectedCell.className.replace(' selected', '') // get rid of selected tag
		}
		for(var i = 0; i<8; i++) {
			for(var j = 0; j<8; j++) {
				if(virtualBoard[i][j] instanceof King) {
					if(this.color == virtualBoard[i][j].color) {
						if(virtualBoard[i][j].isKingChecked(i, j, this.color)) {
							console.log("King is Checked");

							virtualBoard[rowPrevious][colPrevious] = virtualBoard[rowNow][colNow]; // cancels the move
							virtualBoard[rowNow][colNow] = '';
							return;
						}
					}
				}
			}
		}

		document.querySelector(`.${pieceInfo[0]}.${pieceInfo[1]}`).remove(); // removes piece from old square
		var p = document.createElement('div'); // makes a new div called p
		p.className = `${pieceInfo[0]} ${cellCoord}`; // puts the first part of pieceInfo and the cellCoord into the p's className
		document.getElementById(cellCoord).appendChild(p); // puts the piece we created in js into the cell that we clicked on

		pieceInfo = null;
		turn++;
		var thisTurnColor;
		var thisTurnKing;
		turn % 2 == 0 ? thisTurnColor = 'w' : thisTurnColor = "b"
		console.log(thisTurnColor);

		for(var i = 0; i < 8; i++) {
			thisTurnKing = virtualBoard[i].find(p => p !== "" && p.pieceName == thisTurnColor + "k");
			if(thisTurnKing) { break }
		}

		console.log(thisTurnKing);
		if(thisTurnKing.isCheckmated()) {

			alert("you lost")
		}
	}

	eatPiece() {
		document.querySelector(`.${virtualBoard[convertRowsToIndex(cellCoord[1])][convertColsToIndex(cellCoord[0])].pieceName}.${cellCoord}`).remove();
		virtualBoard[convertRowsToIndex(cellCoord[1])][convertColsToIndex(cellCoord[0])] = "";

		this.movePiece();
	}

	blockedHorizontal() {
		for(var i = Math.min(convertColsToIndex(this.coords[0])+1, convertColsToIndex(cellCoord[0])+1);
		i < Math.max(convertColsToIndex(this.coords[0]), convertColsToIndex(cellCoord[0])); i++ ) {
			if(virtualBoard[convertRowsToIndex(this.coords[1])][i]) { return true }
		}
	}

	blockedVertical() {
		for(var i = Math.min(convertRowsToIndex(this.coords[1])+1, convertRowsToIndex(cellCoord[1])+1);
		i < Math.max(convertRowsToIndex(this.coords[1]), convertRowsToIndex(cellCoord[1])); i++ ) {
			if(virtualBoard[i][convertColsToIndex(this.coords[0])]) { return true }
		}
	}

	blockedDiagonal() {
		for(var i = Math.min(convertRowsToIndex(this.coords[1])+1, convertRowsToIndex(cellCoord[1])+1);
		i < Math.max(convertRowsToIndex(this.coords[1]), convertRowsToIndex(cellCoord[1])); i++ ) {
			if (convertRowsToIndex(cellCoord[1]) > convertRowsToIndex(this.coords[1])) {
				if (convertColsToIndex(cellCoord[0]) > convertColsToIndex(this.coords[0])) { // bottom right
					if(virtualBoard[i][convertColsToIndex(this.coords[0]) + i - Math.min(convertRowsToIndex(this.coords[1])+1, convertRowsToIndex(cellCoord[1])+1) + 1]) { return true }
				} else {  // bottom left
					if(virtualBoard[i][convertColsToIndex(this.coords[0]) + i - Math.min(convertRowsToIndex(this.coords[1])+1, convertRowsToIndex(cellCoord[1])+1) - 1]) { return true }
				}
			} else {
				if (convertColsToIndex(cellCoord[0]) > convertColsToIndex(this.coords[0])) { // top right
					if(virtualBoard[i][convertColsToIndex(cellCoord[0]) - i + Math.min(convertRowsToIndex(this.coords[1])+1, convertRowsToIndex(cellCoord[1])+1) - 1]) { return true }
				} else { // top left
					if(virtualBoard[i][convertColsToIndex(cellCoord[0]) + i - Math.min(convertRowsToIndex(this.coords[1])+1, convertRowsToIndex(cellCoord[1])+1) + 1]) { return true }
				}
			}
		}
	}

	move() {
		var cur_x = convertColsToIndex(this.coords[0]);
		var cur_y = convertRowsToIndex(this.coords[1]);
		let rowsMoved = Math.abs(cur_y - convertRowsToIndex(cellCoord[1]));
		let colsMoved = Math.abs(cur_x - convertColsToIndex(cellCoord[0]));

		this.movePiece();
	}

	isKingChecked(x, y, king_color) {
		// determines if the king is in check from any piece
		// x and y are king's row and column

		for(var i = 0; i<8; i++) {
			for(var j = 0; j<8; j++) {

				if(virtualBoard[i][j] !== '') {
					let vbCanEat = virtualBoard[i][j].canEat(x, y, king_color);

					if(vbCanEat) { return vbCanEat }
				}
			}
		}
		return null;
	}

	canEatHV(r, c, myColor) {
		// vertical and horizontal checking
		let cur_r = convertRowsToIndex(this.coords[1])
		let cur_c = convertColsToIndex(this.coords[0])

		for(var test_r = cur_r - 1; test_r >= 0; test_r--) { // top
			var test_c = cur_c;
			if(this.color == myColor) {
				if((test_r == r) && (test_c==c)) { return true }
				if (virtualBoard[test_r][test_c] !== '' ) { break }
			}
		}

		for(var test_c = cur_c - 1; test_c >= 0; test_c--) { // left
			var test_r = cur_r;
			if(this.color == myColor) {
				if((test_r == r) && (test_c==c)) { return true }
				if (virtualBoard[test_r][test_c] !== '' ) { break }
			}
		}
		for(var test_r = cur_r + 1; test_r < 8; test_r++) { // bottom
			var test_c = cur_c;
			if(this.color == myColor) {
				if((test_r == r) && (test_c==c)) { return true }
				if (virtualBoard[test_r][test_c] !== '' ) { break }
			}
		}
		for(var test_c = cur_c + 1; test_c < 8; test_c++) { // right
			var test_r = cur_r;
			if(this.color == myColor) {
				if((test_r == r) && (test_c==c)) { return true }
				if (virtualBoard[test_r][test_c] !== '' ) { break }
			}
		}
		return false;
	}

	canEatDiagonals(r, c, myColor) {
		let cur_r = convertRowsToIndex(this.coords[1]);
		let cur_c = convertColsToIndex(this.coords[0]);

		for(var test_r = cur_r - 1; test_r >= 0; test_r--) { // top right
			var test_c = cur_c + (cur_r-test_r);

			if(this.color == myColor) {
				if(test_c > 7) { break }
				if( (test_r == r) && (test_c==c)) { return true }
				if (virtualBoard[test_r][test_c] !== '' ) { break }
			}
		}

		for(var test_r = cur_r - 1; test_r >= 0; test_r--) { // top left
			var test_c = cur_c - (cur_r-test_r);

			if(this.color == myColor) {
				if (test_c < 0) { break }
				if( (test_r == r) && (test_c==c)) { return true }
				if (virtualBoard[test_r][test_c] !== '' ) { break }
			}
		}

		for(var test_r = cur_r + 1; test_r < 8; test_r++) { // bottom left
			var test_c = cur_c - (test_r - cur_r);

			if(this.color == myColor) {
				if(test_c < 0) {break}
				if( (test_r == r) && (test_c==c)) { return true }
				if (virtualBoard[test_r][test_c] !== '' ) { break }
			}
		}

		for(var test_r = cur_r + 1; test_r < 8; test_r++) { // bottom right
			var test_c = cur_c + (test_r - cur_r);

			if(this.color == myColor) {
				if (test_c > 7) { break }
				if( (test_r == r) && (test_c==c)) 	{ return true }
				if (virtualBoard[test_r][test_c] !== '' ) { break }
			}
		}
		return false;
	}
}

class Rook extends Piece {
	constructor(color, coords) {
		super(color, coords);

		this.pieceName = color + "r";

	}

	move() {
		if (this.coords[0] == cellCoord[0] || this.coords[1] == cellCoord[1]) {  // checks if it is in the same row or column
			if(this.blockedHorizontal()) { return }  // if blocked horizontally, do nothing
			if(this.blockedVertical()) { return }  // if blocked vertically, do nothing

			this.movePiece();	// moves the piece
		}
	}

	eat() {
		if (this.coords[0] == cellCoord[0] || this.coords[1] == cellCoord[1]) {  // checks if it is in the same row or column
			if(this.blockedHorizontal()) { return }  // if blocked horizontally, do nothing
			if(this.blockedVertical()) { return }  // if blocked vertically, do nothing

			this.eatPiece();

		}
	}

	canEat(r, c) { return this.canEatHV(r, c, this.color) }
}

class Bishop extends Piece {
	constructor(color, row, column) {
		super(color, row, column);

		this.pieceName = color + "b";
	}

	move() {
		let rowsMoved = Math.abs(convertRowsToIndex(this.coords[1]) - convertRowsToIndex(cellCoord[1]));
		let colsMoved = Math.abs(convertColsToIndex(this.coords[0]) - convertColsToIndex(cellCoord[0]));

		if (rowsMoved == colsMoved) {
			if(this.blockedDiagonal()) { return }

			this.movePiece();
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

	canEat(r, c) { return this.canEatDiagonals(r, c, this.color) }
}

class Queen extends Piece {
	constructor(color, row, column) {
		super(color, row, column);

		this.pieceName = color + "q";
	}

	move() {
		let rowsMoved = Math.abs(convertRowsToIndex(this.coords[1]) - convertRowsToIndex(cellCoord[1]));
		let colsMoved = Math.abs(convertColsToIndex(this.coords[0]) - convertColsToIndex(cellCoord[0]));

		if (rowsMoved == colsMoved || this.coords[0] == cellCoord[0] || this.coords[1] == cellCoord[1]) { // bishop + rook logic
			if(rowsMoved == colsMoved && this.blockedDiagonal()) { return }
			if(this.coords[1] == cellCoord[1] && this.blockedHorizontal()) { return }
			if(this.coords[0] == cellCoord[0] && this.blockedVertical()) { return }

			this.movePiece()
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
		}
	}

	canEat(r, c) { return this.canEatHV(r,c) || this.canEatDiagonals(r, c) }
}

class King extends Piece {
	constructor(color, row, column) {
		super(color, row, column);

		this.pieceName = color + "k";
	}

	eat() {
		let rowsMoved = Math.abs(convertRowsToIndex(this.coords[1]) - convertRowsToIndex(cellCoord[1]));
		let colsMoved = Math.abs(convertColsToIndex(this.coords[0]) - convertColsToIndex(cellCoord[0]));

		if (rowsMoved <= 1 && colsMoved <= 1) { this.eatPiece() }
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

	canEat(r, c, myColor) {
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
		let rowsMoved = Math.abs(cur_y - convertRowsToIndex(cellCoord[1]));
		let colsMoved = Math.abs(cur_x - convertColsToIndex(cellCoord[0]));

		if (rowsMoved <= 1 && colsMoved <= 1) { this.movePiece() }
	}

	isCheckmated() {

		var king_x = convertRowsToIndex(this.coords[1]);
		var king_y = convertColsToIndex(this.coords[0]);

		for(var i = -1; i <= 1; i++) {
			for(var j = -1; j <= 1; j++) {
				if(king_x + i > 7 || king_x + i < 0 || king_y + j > 7 || king_y + j < 0) {
					// skip over me please it is oob
				}
				else if(virtualBoard[king_x + i][king_y + j].color == this.color) {
					// Im getting body blocked
				}
				else if(this.isKingChecked(king_x + i, king_y + j, this.color)) {
					// my personal space is being violated
				}
				else {
					return false;
					// i am safe false alarm
				}
			}
		}
		alert("Checkmate you suck lol")
		return true;
		// uh oh im screwed
	}
}

class Knight extends Piece {
	constructor(color, row, column) {
		super(color, row, column);

		this.pieceName = color + "n";
	}

	move() {
		let rowsMoved = Math.abs(convertRowsToIndex(this.coords[1]) - convertRowsToIndex(cellCoord[1]));
		let colsMoved = Math.abs(convertColsToIndex(this.coords[0]) - convertColsToIndex(cellCoord[0]));

		if ((rowsMoved == 2 && colsMoved == 1) || (rowsMoved == 1 && colsMoved == 2)) { this.movePiece() }
	}

	eat() {
		let rowsMoved = Math.abs(convertRowsToIndex(this.coords[1]) - convertRowsToIndex(cellCoord[1]));
		let colsMoved = Math.abs(convertColsToIndex(this.coords[0]) - convertColsToIndex(cellCoord[0]));

		if ((rowsMoved == 2 && colsMoved == 1) || (rowsMoved == 1 && colsMoved == 2)) { this.eatPiece() }
	}

	canEat(r, c, myColor) {
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
}

class Pawn extends Piece {
	constructor(color, row, column) {
		super(color, row, column);

		this.pieceName = color + "p";
	}

	move() {
		let rowsMoved = convertRowsToIndex(this.coords[1]) - convertRowsToIndex(cellCoord[1]);
		let colsMoved = convertColsToIndex(this.coords[0]) - convertColsToIndex(cellCoord[0]);

		// if on 2nd row or 7th row, can move 1 or 2
		if (this.color == "w" && rowsMoved == 1 && colsMoved == 0 || this.color == "b" && rowsMoved == -1 && colsMoved == 0 ||
		this.coords[1] == "2" && rowsMoved == 2 && colsMoved == 0 || this.coords[1] == "7" && rowsMoved == -2 && colsMoved == 0 ) { this.movePiece() }
	}

	eat() {
		let rowsMoved = Math.abs(convertRowsToIndex(this.coords[1]) - convertRowsToIndex(cellCoord[1]));
		let colsMoved = Math.abs(convertColsToIndex(this.coords[0]) - convertColsToIndex(cellCoord[0]));

		if (this.color == "w" && rowsMoved == 1 && colsMoved == 1 || this.color == "b" && rowsMoved == 1 && colsMoved == -1) { this.eatPiece() }
	}

	canEat(r, c, myColor) {

		let cur_r = convertRowsToIndex(this.coords[1]); // coords of pawn
		let cur_c = convertColsToIndex(this.coords[0]); // coords of pawn

		// 1. Check if pawn is black or white
		// 2. If pawn is same color as player's king, ignore it
		// 3. If pawn is opposite color as player, use the black or white status of it to determine if it is going down or up
		// 4. Set up two different cases for if it is moving down or up

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
}
