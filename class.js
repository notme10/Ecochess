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

	eat() {

		let rowsMoved = Math.abs(convertRowsToIndex(this.coords[1]) - convertRowsToIndex(cellCoord[1]));
		let colsMoved = Math.abs(convertColsToIndex(this.coords[0]) - convertColsToIndex(cellCoord[0]));

		if (rowsMoved <= 1 && colsMoved <= 1) {

			this.eatPiece();

		}

	}

	potentialThreatChecker(potentialThreat, pieceType) {
		if(potentialThreat) {
			console.log(potentialThreat);
			var oppColor = this.color=="w" ? "b" : "w";
			if(potentialThreat.color == oppColor && potentialThreat.pieceName[1] == pieceType) {

				console.log("I am in check!")
				return 1;
			}
			return 0;
		}
		else {
			return 0;
		}

	}


	checked() {
		this.isPieceChecked(convertColsToIndex(this.coords[0]), convertRowsToIndex(this.coords[1]));
		return 0;
	}


	isPieceChecked(x, y) { // checks if a tile a piece is trying to go to is in check

		var potentialThreat;

		for(var i = x + 1; i < 8; i++ ) {  // blocked horizontal, to the right\
			potentialThreat = virtualBoard[y][i];
			if(this.potentialThreatChecker(potentialThreat, "r")) {

				return 1;
			}
			if(potentialThreat){ break; }

		}

		for(var i = x - 1; i > -1; i-- ) {  // blocked horizontal, to the left
			potentialThreat = virtualBoard[y][i];
			if(this.potentialThreatChecker(potentialThreat, "r")) {
				return 1;
			}
			if(potentialThreat){ break; }
		}

		for(var i = y+1; i < 8; i++ ) {  // blocked vertical, to the down
			potentialThreat = virtualBoard[i][x];
			if(this.potentialThreatChecker(potentialThreat, "r")) {
				return 1;
			}
			if(potentialThreat){ break; }
		}
		for(var i = y-1; i > -1; i-- ) {  // blocked vertical, to the up
			potentialThreat = virtualBoard[i][x];
			if(this.potentialThreatChecker(potentialThreat, "r")) {
				return 1;
			}
			if(potentialThreat){ break; }
		}

		// diagonals

		for(var i = y+1; i < 8 &&
			x + i - y < 8; i++ ) {  // blocked diagonal, to the down and right
				potentialThreat = virtualBoard[i][x + i - y];

				if(this.potentialThreatChecker(potentialThreat, "b")) {
					return 1;
				}
				if(this.potentialThreatChecker(potentialThreat, "q")) {
					return 1;
				}
				if(potentialThreat){ break; }
			}

			for(var i = y+1; i < 8 &&
				x - i + y < 8; i++ ) {  // blocked diagonal, to the down and left
					potentialThreat = virtualBoard[i][x - i + y];

					if(this.potentialThreatChecker(potentialThreat, "b")) {
						return 1;
					}
					if(this.potentialThreatChecker(potentialThreat, "q")) {
						return 1;
					}
					if(potentialThreat){ break; }
				}

				for(var i = y-1; i > -1 &&
					x - i + y > -1; i-- ) {  // blocked diagonal, to the up and right
						potentialThreat = virtualBoard[i][x - i + y];

						if(this.potentialThreatChecker(potentialThreat, "b")) {
							return 1;
						}
						if(this.potentialThreatChecker(potentialThreat, "q")) {
							return 1;
						}
						if(potentialThreat){ break; }
					}

					for(var i = y-1; i > -1 &&
						x + i - y > -1; i-- ) {  // blocked diagonal, to the up and left
							potentialThreat = virtualBoard[i][x + i - y];

							if(this.potentialThreatChecker(potentialThreat, "b")) {
								return 1;
							}
							if(this.potentialThreatChecker(potentialThreat, "q")) {
								return 1;
							}
							if(potentialThreat){ break; }
						}

						// knights

						for(var i = -2; i < 3; i++) {
							if(i == -2 || i == 2) { // check two left, two right
								if(x + i > -1 && x + i < 8) {
									if(y + 1 < 8 && virtualBoard[y + 1][x + i]) {
										potentialThreat = virtualBoard[y + 1][x + i];
										this.potentialThreatChecker(potentialThreat, "n");
										return 1;
									}

									if(y - 1 > -1 && virtualBoard[y - 1][x + i]) {
										potentialThreat = virtualBoard[y - 1][x + i];
										this.potentialThreatChecker(potentialThreat, "n");
										return 1;
									}
								}
							}

							else if(i == -1 || i == 1) { // check one to the left, one to the right
								if(x + i > -1 && x + i < 8) { // makes sure x coord is inside the virtualBoard
									if((y + 2 < 8) && virtualBoard[y + 2][x + i]) { // makes sure y coord is inside the virtualBoard
										potentialThreat = virtualBoard[y + 2][x + i];
										this.potentialThreatChecker(potentialThreat, "n");
										return 1;
									}

									if(y - 2 > -1 && virtualBoard[y - 2][x + i]) { // makes sure y coord is inside the virtualBoard
										potentialThreat = virtualBoard[y - 2][x + i];
										this.potentialThreatChecker(potentialThreat, "n");
										return 1;
									}
								}
							}
						}
						return 0;
					}

					move() {

						let rowsMoved = Math.abs(convertRowsToIndex(this.coords[1]) - convertRowsToIndex(cellCoord[1]));
						let colsMoved = Math.abs(convertColsToIndex(this.coords[0]) - convertColsToIndex(cellCoord[0]));

						if (rowsMoved <= 1 && colsMoved <= 1) {
							if(this.isPieceChecked(convertColsToIndex(cellCoord[0]), convertRowsToIndex(cellCoord[1]))){
								this.movePiece();
							}
							else {
								console.log("You cannot go there!");
							}
						}
					}
				}

				// King is a potential threat
				// King can move into checked squares




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
