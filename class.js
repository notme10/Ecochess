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

					// dont touch the part above bc its fine as it is

				if(virtualBoard[i][convertColsToIndex(this.coords[0])]) {

					// if there is something in that position in the vitual board, then return true

						return true;

				}
		}

	}

	// FUNCTIONS
	// eat
	// consumed

}

class Rook extends Piece {
	constructor(color, coords) {

		super(color, coords);

		this.pieceName = color + "r";

	}

	move() {

		if (this.coords[0] == cellCoord[0] || this.coords[1] == cellCoord[1]) {

			if(this.blockedHorizontal()){ return; }
		 	if(this.blockedVertical()){ return; }

			this.movePiece();
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
			this.movePiece();
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
			this.movePiece()
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
		if (this.color == "w" && rowsMoved == 1 && colsMoved == 0 || this.color == "b" && rowsMoved == -1 && colsMoved == 0 || this.coords[1] == "2" && rowsMoved == 2 && colsMoved == 0 || this.coords[1] == "7" && rowsMoved == -2 && colsMoved == 0 ) {
			this.movePiece()
		}

	}
}
