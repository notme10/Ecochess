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

		let rowPrevious = rows.indexOf(pieceInfo[1][1]); // we get the row of prev pos
		let colPrevious = columns.indexOf(pieceInfo[1][0]); // we get col of prev pos

		let rowNow = rows.indexOf(cellCoord[1]); // we get row of now pos
		let colNow = columns.indexOf(cellCoord[0]); // we get col of now pos

		virtualBoard[rowNow][colNow] = virtualBoard[rowPrevious][colPrevious]; // new virtual space = old virt space
		virtualBoard[rowPrevious][colPrevious] = ''; // old virt space is set back to ''

		let selectedCell = document.querySelector(".selected") // gets the cell that is selected

		if (selectedCell) {
			selectedCell.className = selectedCell.className.replace(' selected', '') // get rid of selected tag
		}

		for(var i = 0; i<8; i++){
			for(var j = 0; j<8; j++){

				if(virtualBoard[i][j] instanceof King) {


					if(this.color == virtualBoard[i][j].color){

						if(virtualBoard[i][j].isKingChecked(i, j)) {

							console.log("King is Checked");

							virtualBoard[rowPrevious][colPrevious] = virtualBoard[rowNow][colNow];
							virtualBoard[rowNow][colNow] = '';
							return;

						}
					}
				}
			}
		}

		document.querySelector(`.${pieceInfo[0]}.${pieceInfo[1]}`).remove() // removes piece from old square


		var p = document.createElement('div'); // makes a new div called p
		p.className = `${pieceInfo[0]} ${cellCoord}`; // puts the first part of pieceInfo and the cellCoord into the p's className
		document.getElementById(cellCoord).appendChild(p); // puts the piece we created in js into the cell that we clicked on

		pieceInfo = null;

		turn++;
	}

	eatPiece(){

		document.querySelector(`.${virtualBoard[convertRowsToIndex(cellCoord[1])][convertColsToIndex(cellCoord[0])].pieceName}.${cellCoord}`).remove();
		virtualBoard[convertRowsToIndex(cellCoord[1])][convertColsToIndex(cellCoord[0])] = "";

		this.movePiece();

	}

	blockedHorizontal(){

		for(var i = Math.min(convertColsToIndex(this.coords[0])+1, convertColsToIndex(cellCoord[0])+1);
		i < Math.max(convertColsToIndex(this.coords[0]), convertColsToIndex(cellCoord[0])); i++ ) {

			if(virtualBoard[convertRowsToIndex(this.coords[1])][i]) {

				return true;

			}
		}

	}

	blockedVertical(){

		for(var i = Math.min(convertRowsToIndex(this.coords[1])+1, convertRowsToIndex(cellCoord[1])+1);
		i < Math.max(convertRowsToIndex(this.coords[1]), convertRowsToIndex(cellCoord[1])); i++ ) {

			if(virtualBoard[i][convertColsToIndex(this.coords[0])]) {

				return true;

			}
		}

	}

	blockedDiagonal(){

		for(var i = Math.min(convertRowsToIndex(this.coords[1])+1, convertRowsToIndex(cellCoord[1])+1);
		i < Math.max(convertRowsToIndex(this.coords[1]), convertRowsToIndex(cellCoord[1])); i++ ) {


			if (convertRowsToIndex(cellCoord[1]) > convertRowsToIndex(this.coords[1]) ) {

				if (convertColsToIndex(cellCoord[0]) > convertColsToIndex(this.coords[0]) ) {

					if(virtualBoard[i][convertColsToIndex(this.coords[0]) + i - Math.min(convertRowsToIndex(this.coords[1])+1, convertRowsToIndex(cellCoord[1])+1) + 1]) { // bottom right

						return true;

					}

				} else {

					// console.log(i, convertColsToIndex(this.coords[0]) + i - Math.min(convertRowsToIndex(this.coords[1])+1, convertRowsToIndex(cellCoord[1])+1) - 1)

					if(virtualBoard[i][convertColsToIndex(this.coords[0]) + i - Math.min(convertRowsToIndex(this.coords[1])+1, convertRowsToIndex(cellCoord[1])+1) - 1]) { // bottom left

						// console.log(virtualBoard[i][convertColsToIndex(this.coords[0]) + i - Math.min(convertRowsToIndex(this.coords[1])+1, convertRowsToIndex(cellCoord[1])+1) - 1])

						return true

					}

				}

			} else {

				if (convertColsToIndex(cellCoord[0]) > convertColsToIndex(this.coords[0]) ) {  // top right

					if(virtualBoard[i][convertColsToIndex(cellCoord[0]) - i + Math.min(convertRowsToIndex(this.coords[1])+1, convertRowsToIndex(cellCoord[1])+1) - 1]) {

						return true

					}

				} else {

					if(virtualBoard[i][convertColsToIndex(cellCoord[0]) + i - Math.min(convertRowsToIndex(this.coords[1])+1, convertRowsToIndex(cellCoord[1])+1) + 1]) { // top left

						return true

					}

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

	isKingChecked(x, y) { // determines if the king is in check from any piece
		// x and y are king's row and column

		for(var i = 0; i<8; i++) {
			for(var j = 0; j<8; j++) {

				if(virtualBoard[i][j] !== '') {
					let vbCanEat = virtualBoard[i][j].canEat(x, y);
					if(vbCanEat) {

						return vbCanEat;

					}
				}
			}
		}
		return null;
	}

	isKingChecked_oldversion(x, y) { // OLD VERSION
		var potentialThreat;
		var cur_x = convertColsToIndex(this.coords[0]) // current x position
		var cur_y = convertRowsToIndex(this.coords[1]) // current y position

		for(var i = x + 1; i < 8; i++ ) {  // blocked horizontal, to the right

			if ((cur_x == x) && (cur_y == i)) {
				continue;
			}

			potentialThreat = virtualBoard[y][i];
			if(this.potentialThreatChecker(potentialThreat, "r")) {
				return 1;
			}
			if(potentialThreat){ break; }
		}

		for(var i = x - 1; i > -1; i-- ) {  // blocked horizontal, to the left

			if (  (cur_x == x) && (cur_y == i) ) { continue; }

			potentialThreat = virtualBoard[y][i];
			if(this.potentialThreatChecker(potentialThreat, "r")) {
				return 1;
			}
			if(potentialThreat){ break; }
		}

		for(var i = y+1; i < 8; i++ ) {  // blocked vertical, down

			if (  (cur_x == x) && (cur_y == i) ) { continue; }

			potentialThreat = virtualBoard[i][x];
			if(this.potentialThreatChecker(potentialThreat, "r")) {
				return 1;
			}
			if(potentialThreat){ break; }
		}

		for(var i = y-1; i > -1; i-- ) {  // blocked vertical, up

			if (  (cur_x == x) && (cur_y == i) ) { continue; } // it is myself

			potentialThreat = virtualBoard[i][x];
			if(this.potentialThreatChecker(potentialThreat, "r")) {
				return 1;
			}
			if(potentialThreat){ break; }
		}

		// diagonals

		for(var i = y+1; i < 8 && x + i - y < 8; i++ ) {  // blocked diagonal, down and right
			if (  (cur_x == (x + i - y)) && (cur_y == i) ) { continue; } // it is myself
			potentialThreat = virtualBoard[i][x + i - y];

			if(this.potentialThreatChecker(potentialThreat, "b")) {
				return 1;
			}
			if(this.potentialThreatChecker(potentialThreat, "q")) {
				return 1;
			}
			if(potentialThreat){ break; }
		}

		for(var i = y+1; i < 8 && x - i + y < 8; i++ ) {  // blocked diagonal, down and left
			if (  (cur_x == (x - i + y)) && (cur_y == i) ) { continue; } // it is myself
			potentialThreat = virtualBoard[i][x - i + y];

			if(this.potentialThreatChecker(potentialThreat, "b")) {
				return 1;
			}
			if(this.potentialThreatChecker(potentialThreat, "q")) {
				return 1;
			}
			if(potentialThreat){ break; }
		}

		for(var i = y-1; i > -1 && x - i + y > -1; i-- ) {  // blocked diagonal, to the up and right
			if (  (cur_x == (x - i + y)) && (cur_y == i) ) { continue; } // it is myself
			potentialThreat = virtualBoard[i][x - i + y];

			if(this.potentialThreatChecker(potentialThreat, "b")) {
				return 1;
			}
			if(this.potentialThreatChecker(potentialThreat, "q")) {
				return 1;
			}
			if(potentialThreat){ break; }
		}

		for(var i = y-1; i > -1 && x + i - y > -1; i-- ) {  // blocked diagonal, to the up and left
			if (  (cur_x == (x + i - y)) && (cur_y == i) ) { continue; } // it is myself
			potentialThreat = virtualBoard[i][x + i - y];

			if(this.potentialThreatChecker(potentialThreat, "b")) {
				return 1;
			}
			if(this.potentialThreatChecker(potentialThreat, "q")) {
				return 1;
			}
			if(potentialThreat){ break; }
		}

		for(var i = -2; i < 3; i++) {
			if(i == -2 || i == 2) { // check two left, two right
				if(x + i > -1 && x + i < 8) {
					if(y + 1 < 8 && virtualBoard[y + 1][x + i]) {
						potentialThreat = virtualBoard[y + 1][x + i];
						if(this.potentialThreatChecker(potentialThreat, "n")) {
							return 1;
						}
					}

					if(y - 1 > -1 && virtualBoard[y - 1][x + i]) {
						potentialThreat = virtualBoard[y - 1][x + i];
						if(this.potentialThreatChecker(potentialThreat, "n")) {
							return 1;
						}
					}
				}
			}

			else if(i == -1 || i == 1) { // check one to the left, one to the right
				if(x + i > -1 && x + i < 8) { // makes sure x coord is inside the board
					if((y + 2 < 8) && virtualBoard[y + 2][x + i]) { // makes sure y coord is inside the board
						potentialThreat = virtualBoard[y + 2][x + i];
						if(this.potentialThreatChecker(potentialThreat, "n")) {
							return 1;
						}
					}

					if(y - 2 > -1 && virtualBoard[y - 2][x + i]) { // makes sure y coord is inside the board
						potentialThreat = virtualBoard[y - 2][x + i];
						if(this.potentialThreatChecker(potentialThreat, "n")) {
							return 1;
						}
					}
				}
			}
		}
		return 0;
	}

}

class Rook extends Piece {
	constructor(color, coords) {

		super(color, coords);

		this.pieceName = color + "r";

	}

	move() {

		if (this.coords[0] == cellCoord[0] || this.coords[1] == cellCoord[1]) {  // checks if it is in the same row or column

			if(this.blockedHorizontal()){ return; }  // if blocked horizontally, do nothing
			if(this.blockedVertical()){ return; }  // if blocked vertically, do nothing

			this.movePiece();	// moves the piece
		}

	}

	eat() {

		if (this.coords[0] == cellCoord[0] || this.coords[1] == cellCoord[1]) {  // checks if it is in the same row or column

			if(this.blockedHorizontal()){ return; }  // if blocked horizontally, do nothing
			if(this.blockedVertical()){ return; }  // if blocked vertically, do nothing

			this.eatPiece();

		}

	}

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

	canEat(r, c) {

		let cur_r = convertRowsToIndex(this.coords[1])
		let cur_c = convertColsToIndex(this.coords[0])

		for(var test_r = cur_r - 1; test_r >= 0; test_r--) { // top right
			if (test_r < 0) { break }
			var test_c = cur_c + (cur_r-test_r);
			document.getElementById(`${convertIndexToCols(test_c)}${convertIndexToRows(test_r)}`).className += " testing1"
			if( (test_r == r) && (test_c==c)) {return this}
			if (virtualBoard[test_r][test_c] !== '' ) {break}
		}
		for(var test_r = cur_r - 1; test_r >= 0; test_r--) { // top left
			if (test_r < 0) { break }
			var test_c = cur_c - (cur_r-test_r);
			if (test_c < 0) { break }
			document.getElementById(`${convertIndexToCols(test_c)}${convertIndexToRows(test_r)}`).className += " testing2"
			if( (test_r == r) && (test_c==c)) {return this}
			if (virtualBoard[test_r][test_c] !== '' ) {break}

		}
		for(var test_r = cur_r + 1; test_r < 8; test_r++) { // bottom left
			var test_c = cur_c + (cur_r-test_r);
			if (test_c < 0) { break }
			if (test_r < 0) { break }

			console.log(virtualBoard);


			// console.log("test c = " + test_c);
			// console.log("test r = " + test_r);
			// console.log("cur c = " + cur_c);
			// console.log("cur r = " + cur_r);
			// console.log(document.getElementById(`${convertIndexToCols(test_c)}${convertIndexToRows(test_r)}`));

			document.getElementById(`${convertIndexToCols(test_c)}${convertIndexToRows(test_r)}`).className += " testing3"
			if( (test_r == r) && (test_c==c)) {return this}
			if (virtualBoard[test_r][test_c] !== '' ) {break}
		}

		for(var test_r = cur_r + 1; test_r < 8; test_r++) { // bottom right
			var test_c = cur_c - (cur_r-test_r);
			if (test_c > 7) { break }
			document.getElementById(`${convertIndexToCols(test_c)}${convertIndexToRows(test_r)}`).className += " testing4"
			if( (test_r == r) && (test_c==c)) 	{return this}
			if (virtualBoard[test_r][test_c] !== '' ) {break}
		}

		return false;

	}

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
}

class King extends Piece {
	constructor(color, row, column) {

		super(color, row, column);

		this.pieceName = color + "k";

	}

	eat() {

		let rowsMoved = Math.abs(convertRowsToIndex(this.coords[1]) - convertRowsToIndex(cellCoord[1]));
		let colsMoved = Math.abs(convertColsToIndex(this.coords[0]) - convertColsToIndex(cellCoord[0]));

		if (rowsMoved <= 1 && colsMoved <= 1) {

			this.eatPiece();

		}

	}

	potentialThreatChecker(potentialThreat, pieceType) {
		if(potentialThreat) {
			var oppColor = this.color=="w" ? "b" : "w";
			if(potentialThreat.color == oppColor && potentialThreat.pieceName[1] == pieceType) {
				return 1;
			}
			return 0;
		}
		else {
			return 0;
		}

	}

	canEat(r, c) {

		let cur_r = convertRowsToIndex(this.coords[1])
		let cur_c = convertColsToIndex(this.coords[0])

		if(cur_r + 1 == r) {
			if(cur_c == c) {return this}
			if(cur_c + 1 == c) {return this}
			if(cur_c - 1 == c) {return this}
		} else if(cur_r==r) {
			if(cur_c + 1 == c) {return this}
			if(cur_c - 1 == c) {return this}
		} else if(cur_r - 1 == r) {
			if(cur_c == c) {return this}
			if(cur_c + 1 == c) {return this}
			if(cur_c - 1 == c) {return this}
		}

		return false;

	}

	move() {

		var cur_x = convertColsToIndex(this.coords[0]);
		var cur_y = convertRowsToIndex(this.coords[1]);
		let rowsMoved = Math.abs(cur_y - convertRowsToIndex(cellCoord[1]));
		let colsMoved = Math.abs(cur_x - convertColsToIndex(cellCoord[0]));

		if (rowsMoved <= 1 && colsMoved <= 1) {

			let threateningPiece = this.isKingChecked(convertColsToIndex(cellCoord[0]), convertRowsToIndex(cellCoord[1]), virtualBoard);
			if((threateningPiece && threateningPiece.pieceName[0] == this.pieceName[0]) || !threateningPiece) {
				this.movePiece();
			}

			else {

				console.log("You cannot go there! The threatening piece is: ");
				console.log(threateningPiece);

			}
		}
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

		if ((rowsMoved == 2 && colsMoved == 1) || (rowsMoved == 1 && colsMoved == 2)) {
			this.movePiece()
		}

	}

	eat() {

		let rowsMoved = Math.abs(convertRowsToIndex(this.coords[1]) - convertRowsToIndex(cellCoord[1]));
		let colsMoved = Math.abs(convertColsToIndex(this.coords[0]) - convertColsToIndex(cellCoord[0]));

		if ((rowsMoved == 2 && colsMoved == 1) || (rowsMoved == 1 && colsMoved == 2)) {

			this.eatPiece();

		}

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
		this.coords[1] == "2" && rowsMoved == 2 && colsMoved == 0 || this.coords[1] == "7" && rowsMoved == -2 && colsMoved == 0 ) {

			this.movePiece()
		}

	}



	eat() {

		let rowsMoved = Math.abs(convertRowsToIndex(this.coords[1]) - convertRowsToIndex(cellCoord[1]));
		let colsMoved = Math.abs(convertColsToIndex(this.coords[0]) - convertColsToIndex(cellCoord[0]));

		if (this.color == "w" && rowsMoved == 1 && colsMoved == 1 || this.color == "b" && rowsMoved == 1 && colsMoved == -1) {

			this.eatPiece();

		}

	}

}
