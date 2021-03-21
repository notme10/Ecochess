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

	// FUNCTIONS
	// move
	// eat
	// consumed


}

class Rook extends Piece {
	constructor(color, coords) {

		super(color, coords);

		this.pieceName = color + "r";

	}

	move() {
		// if there is a piece in the same row or column as the rook it cannot move on or past it
		// how do we know if there's a piece there?
		// how do we ensure that the rook can move before the piece not not past it?

		// cellCoord, virtualBoard, this.coords, this.pieceName
		// make a nested for loop to go through the virtualBoard

		for (let r = 0; r < 8; r++) {
			for (let c = 0; c < 8; c++) {
				// what goes in here
				// console.log(virtualBoard[r][c])

				if (virtualBoard[r][c] && this.coords[1] == virtualBoard[r][c].coords[1]) {
					// don't allow move on or past that space
					// need to check if it's on left or right by comparing the columns
					if (this.coords[0] < virtualBoard[r][c].coords[0]) {
						cellCoords
					}

					if (/* a piece is BETWEEEN this.coords and cellCoords, don't allow it */true) {
						// make a utility function that determines if a coord is between two coordinates diagonally, horizontally, or vertically
						// if it is, return;
						// if it is not, allow the move
					}
					// what if it's left
					//// if the piece is on the left of the rook, cannot click to the left of that piece
				}

				// check if row of piece on board and row of rook are equal
				//// don't allow move on or past that space
				// same for column
			}
		}

		////////////////////////////////////////////////////////

		if (this.coords[0] == cellCoord[0] || this.coords[1] == cellCoord[1]) { // if cell clicked on row = the piece's row or same with
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

		let rowsMoved = Math.abs(rows.indexOf(this.coords[1]) - rows.indexOf(cellCoord[1]));
		let colsMoved = Math.abs(columns.indexOf(this.coords[0]) - columns.indexOf(cellCoord[0]));

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

		let rowsMoved = Math.abs(rows.indexOf(this.coords[1]) - rows.indexOf(cellCoord[1]));
		let colsMoved = Math.abs(columns.indexOf(this.coords[0]) - columns.indexOf(cellCoord[0]));

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

		let rowsMoved = Math.abs(rows.indexOf(this.coords[1]) - rows.indexOf(cellCoord[1]));
		let colsMoved = Math.abs(columns.indexOf(this.coords[0]) - columns.indexOf(cellCoord[0]));

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

		let rowsMoved = Math.abs(rows.indexOf(this.coords[1]) - rows.indexOf(cellCoord[1]));
		let colsMoved = Math.abs(columns.indexOf(this.coords[0]) - columns.indexOf(cellCoord[0]));

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

		let rowsMoved = rows.indexOf(this.coords[1]) - rows.indexOf(cellCoord[1]);
		let colsMoved = columns.indexOf(this.coords[0]) - columns.indexOf(cellCoord[0]);

		// if on 2nd row or 7th row, can move 1 or 2
		if (this.color == "w" && rowsMoved == 1 && colsMoved == 0 || this.color == "b" && rowsMoved == -1 && colsMoved == 0 || this.coords[1] == "2" && rowsMoved == 2 && colsMoved == 0 || this.coords[1] == "7" && rowsMoved == -2 && colsMoved == 0 ) {
			this.movePiece()
		}

	}
}
