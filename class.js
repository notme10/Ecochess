class Piece {
	constructor(color) {
		this.color = color;
		this.coords;
	}

	setCoord(coord) {
		this.coords = coord;
	}

	movePiece() {
		// Select the element in JS
		// e.target
		document.querySelector(`.${pieceInfo[0]}.${pieceInfo[1]}`).remove() // removes piece from old square
		// selects the piece on the board and then deletes it from existence

		// make the piece on the new square
		var p = document.createElement('div'); // makes a new div called p
		p.className = `${pieceInfo[0]} ${cellCoord}`; // puts the first part of pieceInfo and the cellCoord into the p's className
		document.getElementById(cellCoord).appendChild(p); // puts the piece we created in js into the cell that we clicked on

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

		// resets pieceInfo
		pieceInfo = null;

		turn++;

		console.log(turn);

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

					console.log(i, convertColsToIndex(this.coords[0]) + i - Math.min(convertRowsToIndex(this.coords[1])+1, convertRowsToIndex(cellCoord[1])+1) - 1)

					if(virtualBoard[i][convertColsToIndex(this.coords[0]) + i - Math.min(convertRowsToIndex(this.coords[1])+1, convertRowsToIndex(cellCoord[1])+1) - 1]) { // bottom left

						console.log(virtualBoard[i][convertColsToIndex(this.coords[0]) + i - Math.min(convertRowsToIndex(this.coords[1])+1, convertRowsToIndex(cellCoord[1])+1) - 1])

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

	move() {

		let rowsMoved = Math.abs(convertRowsToIndex(this.coords[1]) - convertRowsToIndex(cellCoord[1]));
		let colsMoved = Math.abs(convertColsToIndex(this.coords[0]) - convertColsToIndex(cellCoord[0]));

		if (rowsMoved <= 1 && colsMoved <= 1) {
			this.movePiece()
		}

	}

	eat() {

		let rowsMoved = Math.abs(convertRowsToIndex(this.coords[1]) - convertRowsToIndex(cellCoord[1]));
		let colsMoved = Math.abs(convertColsToIndex(this.coords[0]) - convertColsToIndex(cellCoord[0]));

		if (rowsMoved <= 1 && colsMoved <= 1) {

			this.eatPiece();

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
