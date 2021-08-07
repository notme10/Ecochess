/*

IMPORTNANT STUFF TO DO!!!

									1. Promotion -- done
2. Castling
	a) create variable to check if king or rook has moved at all
	b) check if there's nothing in between king and Rook
	c) check if king is in check before castling
	d) if both these conditions are true, the king is allowed to move either two to the right or three to the left
	e) move rook to the appropriate position
3. En Passant
	a) pawn moves two spaces forward
	b) on the next turn, an opposite color pawn is next to the pawn that just moved
	c) pawn moves diagonally into the column of the first pawn
										4. Black can't eat bug fix
5. black queen cannot move



6. Gather facts for different regions

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
		// return true if move is allowed, false if move is not allowed
		var prv_coords = this.coords;
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
							virtualBoard[rowPrevious][colPrevious] = virtualBoard[rowNow][colNow]; // cancels the move
							virtualBoard[rowNow][colNow] = '';
							this.coords = prv_coords;
							return false;
						}
					}
				}
			}
		}

		document.querySelector(`.${pieceInfo[0]}.${pieceInfo[1]}`).remove(); // removes piece from old square
		if(pieceInfo[0] == "wp" && pieceInfo[1][1] == "7") {
			var p = document.createElement('div'); // makes a new div called p
			p.className = `${"wq"} ${cellCoord}`; // puts the first part of pieceInfo and the cellCoord into the p's className
			document.getElementById(cellCoord).appendChild(p); // puts the piece we created in js into the cell that we clicked on
		}
		if(pieceInfo[0] == "bp" && pieceInfo[1][1] == "2") {
			var p = document.createElement('div'); // makes a new div called p
			p.className = `${"bq"} ${cellCoord}`; // puts the first part of pieceInfo and the cellCoord into the p's className
			document.getElementById(cellCoord).appendChild(p); // puts the piece we created in js into the cell that we clicked on
		}
		else {
			var p = document.createElement('div'); // makes a new div called p
			p.className = `${pieceInfo[0]} ${cellCoord}`; // puts the first part of pieceInfo and the cellCoord into the p's className
			document.getElementById(cellCoord).appendChild(p); // puts the piece we created in js into the cell that we clicked on
		}





	pieceInfo = null;
	turn++;
	var thisTurnColor;
	var thisTurnKing;
	turn % 2 == 1 ? thisTurnColor = 'b' : thisTurnColor = "w"
	// console.log(thisTurnColor);

	for(var i = 0; i < 8; i++) {
		// console.log(virtualBoard[i].find(p => p !== "" && p.pieceName == thisTurnColor + "k"));
		// console.log(thisTurnColor);
		thisTurnKing = virtualBoard[i].find(p => p !== "" && p.pieceName == thisTurnColor + "k");
		if(thisTurnKing) { break }
	}


	// if(thisTurnKing.isCheckmated()) {
	// 	alert("you lost")
	// }
	return true;
}

eatPiece() {
	//document.querySelector(`.${virtualBoard[convertRowsToIndex(cellCoord[1])][convertColsToIndex(cellCoord[0])].pieceName}.${cellCoord}`).remove();
	var t = document.querySelector(`.${virtualBoard[convertRowsToIndex(cellCoord[1])][convertColsToIndex(cellCoord[0])].pieceName}.${cellCoord}`)
	var q = t.className;
	console.log(t.className);
	t.remove();

	var tempPiece = virtualBoard[convertRowsToIndex(cellCoord[1])][convertColsToIndex(cellCoord[0])];
	virtualBoard[convertRowsToIndex(cellCoord[1])][convertColsToIndex(cellCoord[0])] = "";

	if(this.movePiece()) {
	} else {
		virtualBoard[convertRowsToIndex(cellCoord[1])][convertColsToIndex(cellCoord[0])] = tempPiece;
		var p = document.createElement('div'); // makes a new div called p
		p.className = q; // puts the first part of pieceInfo and the cellCoord into the p's className
		document.getElementById(cellCoord).appendChild(p); // puts the piece we created in js into the cell that we clicked on
	}

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
	var start_row = convertRowsToIndex(this.coords[1]);
	var start_col = convertColsToIndex(this.coords[0]);
	var end_row = convertRowsToIndex(cellCoord[1]);
	var end_col = convertColsToIndex(cellCoord[0]);
	if( (start_row < end_row) && (start_col < end_col) ) {
		for( var i=start_row+1, j=start_col+1; i<end_row; i++, j++ ) {
			if (virtualBoard[i][j]) {return true}
		}
	}
	if( (start_row < end_row) && (start_col > end_col) ) {
		for( var i=start_row+1, j=start_col-1; i<end_row; i++, j-- ) {
			if (virtualBoard[i][j]) {return true}
		}
	}
	if( (start_row > end_row) && (start_col < end_col) ) {
		for( var i=start_row-1, j=start_col+1; i>end_row; i--, j++ ) {
			if (virtualBoard[i][j]) {return true}
		}
	}
	if( (start_row > end_row) && (start_col > end_col) ) {
		for( var i=start_row-1, j=start_col-1; i>end_row; i--, j-- ) {
			if (virtualBoard[i][j]) {return true}
		}
	}

	// for(var i = Math.min(convertRowsToIndex(this.coords[1])+1, convertRowsToIndex(cellCoord[1])+1);
	// i < Math.max(convertRowsToIndex(this.coords[1]), convertRowsToIndex(cellCoord[1])); i++ ) {
	// 	if (convertRowsToIndex(cellCoord[1]) > convertRowsToIndex(this.coords[1])) {
	// 		if (convertColsToIndex(cellCoord[0]) > convertColsToIndex(this.coords[0])) { // bottom right
	// 			if(virtualBoard[i][convertColsToIndex(this.coords[0]) + i - Math.min(convertRowsToIndex(this.coords[1])+1, convertRowsToIndex(cellCoord[1])+1) + 1]) { return true }
	// 		} else {  // bottom left
	// 			var min = Math.min(convertRowsToIndex(this.coords[1])+1, convertRowsToIndex(cellCoord[1])+1) - 1;
	// 			var col = convertColsToIndex(this.coords[0]) + i - min;
	// 			if(virtualBoard[i][col]) { return true }
	// 		}
	// 	} else {
	// 		if (convertColsToIndex(cellCoord[0]) > convertColsToIndex(this.coords[0])) { // top right
	// 			if(virtualBoard[i][convertColsToIndex(cellCoord[0]) - i + Math.min(convertRowsToIndex(this.coords[1])+1, convertRowsToIndex(cellCoord[1])+1) - 1]) { return true }
	// 		} else { // top left
	// 			if(virtualBoard[i][convertColsToIndex(cellCoord[0]) + i - Math.min(convertRowsToIndex(this.coords[1])+1, convertRowsToIndex(cellCoord[1])+1) + 1]) { return true }
	// 		}
	// 	}
	// }
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
				let vbCanEat = virtualBoard[i][j].canEatKingAt(x, y, king_color);

				if(vbCanEat) { return true }
			}
		}
	}
	return false;
}

canEatHV(r, c, myColor) {
	// vertical and horizontal checking
	let cur_r = convertRowsToIndex(this.coords[1])
	let cur_c = convertColsToIndex(this.coords[0])

	for(var test_r = cur_r - 1; test_r >= 0; test_r--) { // top
		var test_c = cur_c;
		if(this.color != myColor) {
			if((test_r == r) && (test_c == c)) { return true }
			if (virtualBoard[test_r][test_c] !== '' ) { break }
		}
	}
	for(var test_c = cur_c - 1; test_c >= 0; test_c--) { // left
		var test_r = cur_r;
		if(this.color != myColor) {
			if((test_r == r) && (test_c == c)) { return true }
			if (virtualBoard[test_r][test_c] !== '' ) { break }
		}
	}
	for(var test_r = cur_r + 1; test_r < 8; test_r++) { // bottom
		var test_c = cur_c;
		if(this.color != myColor) {
			if((test_r == r) && (test_c == c)) { return true }
			if (virtualBoard[test_r][test_c] !== '' ) { break }
		}
	}
	for(var test_c = cur_c + 1; test_c < 8; test_c++) { // right
		var test_r = cur_r;
		if(this.color != myColor) {
			if((test_r == r) && (test_c == c)) { return true }
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

		if(this.color != myColor) {
			if(test_c > 7) { break }
			if( (test_r == r) && (test_c==c)) { return true }
			if (virtualBoard[test_r][test_c] !== '' ) { break }
		}
	}

	for(var test_r = cur_r - 1; test_r >= 0; test_r--) { // top left
		var test_c = cur_c - (cur_r-test_r);

		if(this.color != myColor) {
			if (test_c < 0) { break }
			if( (test_r == r) && (test_c==c)) { return true }
			if (virtualBoard[test_r][test_c] !== '' ) { break }
		}
	}

	for(var test_r = cur_r + 1; test_r < 8; test_r++) { // bottom left
		var test_c = cur_c - (test_r - cur_r);

		if(this.color != myColor) {
			if(test_c < 0) {break}
			if( (test_r == r) && (test_c==c)) { return true }
			if (virtualBoard[test_r][test_c] !== '' ) { break }
		}
	}

	for(var test_r = cur_r + 1; test_r < 8; test_r++) { // bottom right
		var test_c = cur_c + (test_r - cur_r);

		if(this.color != myColor) {
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
		var hasRookMoved = 0; // rook has not moved yet in the beginning
	}

	move() {
		if (this.coords[0] == cellCoord[0] || this.coords[1] == cellCoord[1]) {  // checks if it is in the same row or column
			if(this.blockedHorizontal()) { return }  // if blocked horizontally, do nothing
			if(this.blockedVertical()) { return }  // if blocked vertically, do nothing

			this.movePiece();	// moves the piece
			var hasRookMoved = 1; // rook has now moved
		}
	}

	eat() {
		if (this.coords[0] == cellCoord[0] || this.coords[1] == cellCoord[1]) {  // checks if it is in the same row or column
			if(this.blockedHorizontal()) { return }  // if blocked horizontally, do nothing
			if(this.blockedVertical()) { return }  // if blocked vertically, do nothing

			this.eatPiece();

		}
	}

	// castle() {
	// 	if(hasRookMoved == 0, virtualBoard[][]) {
	//
	//
	//
	// 	}


	// }

	canEatKingAt(r, c, myColor) { return this.canEatHV(r, c, myColor) }
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

	canEatKingAt(r, c, myColor) { return this.canEatDiagonals(r, c, myColor) }
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

	canEatKingAt(r, c, myColor) { return this.canEatHV(r, c, myColor) || this.canEatDiagonals(r, c, myColor) }
}

class King extends Piece {
	constructor(color, row, column) {
		super(color, row, column);

		this.pieceName = color + "k";
	}

	eat() {
		// console.log("fjdkljsflks");
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
		let rowsMoved = Math.abs(cur_y - convertRowsToIndex(cellCoord[1]));
		let colsMoved = Math.abs(cur_x - convertColsToIndex(cellCoord[0]));

		if (rowsMoved <= 1 && colsMoved <= 1) {
			this.movePiece()
		}

		// if king is trying to castle:

	}

	helperFunction(new_x, new_y, old_x, old_y) {

		virtualBoard[new_x][new_y] = virtualBoard[old_x][old_y]; // new virtual space = old virt space
		virtualBoard[old_x][old_y] = ''; // old virt space is set back to ''
		var result = this.isKingChecked(new_x, new_y, this.color);
		virtualBoard[old_x][old_y] = virtualBoard[new_x][new_y]; // cancels the move
		virtualBoard[new_x][new_y] = '';
		return result;

	}

	isCheckmated() {

		var king_x = convertRowsToIndex(this.coords[1]);
		var king_y = convertColsToIndex(this.coords[0]);

		for(var i = -1; i <= 1; i++) {
			for(var j = -1; j <= 1; j++) {
				if(king_x + i > 7 || king_x + i < 0 || king_y + j > 7 || king_y + j < 0) {
					// skip over me please it is oob
					// console.log(i,j,"oob");
				}
				else if(i !== 0 && j !== 0 && virtualBoard[king_x + i][king_y + j].color == this.color) {
					// Im getting body blocked
					// console.log(i,j,"body blocked");
				}
				else if(this.helperFunction(king_x + i, king_y + j, king_x, king_y)) {
					// my personal space is being violated
					// console.log(i,j, "attacked");
				}
				else {
					// console.log(i,j, "safe");
					return false;

					// i am safe false alarm
				}
			}
		}
		alert("Checkmate :))")
		// change to modal in the future instead of alert
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

		let cur_r = convertRowsToIndex(this.coords[1]); // coords of pawn
		let cur_c = convertColsToIndex(this.coords[0]); // coords of pawn

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
