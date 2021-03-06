/*
IMPORTNANT STUFF TO DO!!!

- checkmate situation 1: checkmate even when attacking piece can be eaten

- checkmate situation 2: checkmate even when attack can be blocked
	- check if a piece is being pinned
	- check if all available non-pinned pieces can block a check

*/

/*
PIECES OBJECT!!!

	- contains info of all "living" pieces
	- if a piece dies, it gets taken off
	- object is used to quickly find a piece I want
*/

class Piece {
	constructor(color, coords) {
		this.color = color;
		this.coords = coords;
		this.hasMoved = 0;
		this.pinned = false;
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

		 // PROMOTION
		 var prevRow = (this.color == "w") ? "7" : "2";
		 var curRow = (this.color == "w") ? 0 : 7;

		if((pieceInfo[0] == this.color + "p") && (pieceInfo[1][1] == prevRow) && (rowNow == curRow)) { // if pawn is at the 7th or 2nd row
			var promotionDone = false;

			while(promotionDone == false) {
				// ask user until user provides valid piece name
				var promotionPiece = window.prompt("What piece do you want?")

				switch(promotionPiece) {
					case "q": // promote to queen
						virtualBoard[rowNow][colNow] = new Queen(this.color, cellCoord);
						promotionDone = true;
						moveList.push(this.color+ "p promoted to queen on turn " + (turn+1));
						break;
					case "b": // promote to bishop
						virtualBoard[rowNow][colNow] = new Bishop(this.color, cellCoord);
						promotionDone = true;
						moveList.push(this.color+ "p promoted to bishop on turn " + (turn+1));
						break;
					case "r": // promote to rook
						virtualBoard[rowNow][colNow] = new Rook(this.color, cellCoord);
						promotionDone = true;
						moveList.push(this.color+ "p promoted to rook on turn " + (turn+1));
						break;
					case "n": // promote to knight
						virtualBoard[rowNow][colNow] = new Knight(this.color, cellCoord);
						promotionDone = true;
						moveList.push(this.color+ "p promoted to knight on turn " + (turn+1));
						break;
				}
			}

			var p = document.createElement('div'); // makes a new div called p

			p.className = `${this.color + promotionPiece} ${cellCoord}`; // creates promoted piece
			document.getElementById(cellCoord).appendChild(p); // puts the piece we created in js into the cell that we clicked on
		}

		else { // normal move
			var p = document.createElement('div'); // makes a new div called p

			p.className = `${pieceInfo[0]} ${cellCoord}`; // puts the first part of pieceInfo and the cellCoord into the p's className
			document.getElementById(cellCoord).appendChild(p); // puts the piece we created in js into the cell that we clicked on
		}

		var pawns = pieces[this.color + "p"]
		for(var i = 0; i<pawns.length; i++) {
			pawns[i].enPassantPossible	= false;
		}

		turn++;

		if(moveList.length < turn) {
			moveList.push(this.pieceName + " moved from " + prv_coords + " to " + this.coords + " on turn " + (turn))
		}

		var newMove = document.createElement("div");
		newMove.classList += "move";
		newMove.innerText = moveList[moveList.length-1];
		document.querySelector("#movesBox").appendChild(newMove);




		var thisTurnColor;
		var thisTurnKing;
		turn % 2 == 1 ? thisTurnColor = 'b' : thisTurnColor = "w";

		for(var i = 0; i < 8; i++) {
			thisTurnKing = virtualBoard[i].find(p => p !== "" && p.pieceName == thisTurnColor + "k");
			if(thisTurnKing) {
				break;
			}
		}

		if(thisTurnKing.isCheckmated()) {
			alert("Checkmate");
		}
		return true;
	}

	// CAPTURING
	eatPiece() {

		var previousPosition = this.coords;
		var x = convertRowsToIndex(cellCoord[1]);
		var y = convertColsToIndex(cellCoord[0]);

		var t = document.querySelector(`.${virtualBoard[x][y].pieceName}.${cellCoord}`)
		var q = t.className;
		t.remove();
		pieces[virtualBoard[x][y].pieceName] = pieces[virtualBoard[x][y].pieceName].filter(item => item.coords !== cellCoord);

		var tempPiece = virtualBoard[x][y];
		virtualBoard[x][y] = "";

		if(this.movePiece()) {
			moveList.push(this.pieceName + " on " + previousPosition + " captured a piece on turn "+ (turn+1));

			var newMove = document.createElement("div");
			newMove.classList += "move";
			newMove.innerText = moveList[moveList.length-1];
			document.querySelector("#movesBox").appendChild(newMove);

		} else {
			virtualBoard[x][y] = tempPiece;
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
				if (virtualBoard[i][j]) { return true }
			}
		}

		if((start_row < end_row) && (start_col > end_col)) {
			for( var i=start_row+1, j=start_col-1; i<end_row; i++, j-- ) {
				if (virtualBoard[i][j]) { return true }
			}
		}

		if((start_row > end_row) && (start_col < end_col)) {
			for( var i=start_row-1, j=start_col+1; i>end_row; i--, j++ ) {
				if (virtualBoard[i][j]) { return true }
			}
		}

		if((start_row > end_row) && (start_col > end_col)) {
			for( var i=start_row-1, j=start_col-1; i>end_row; i--, j-- ) {
				if (virtualBoard[i][j]) { return true }
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

	// CHECK
	isKingChecked(x, y, king_color) {
		for(var i = 0; i<8; i++) {
			for(var j = 0; j<8; j++) {

				if(virtualBoard[i][j] !== '') {
					let vbCanEat = virtualBoard[i][j].canEatKingAt(x, y, king_color);

					if(vbCanEat) {
						return true;
					}
				}
			}
		}
		return false;
	}

	isPinned() {
		// temporarily get rid of piece that is supposedly is pinned
		// if king is in check, pinned = true
		// if king is not in check, pinned = false
		// replace the removed piece where it was before

		var x = convertRowsToIndex(this.coords[1]);
		var y = convertColsToIndex(this.coords[0]);

		var tempStorage = virtualBoard[x][y];
		virtualBoard[x][y] = '';

		var kingCoords = pieces[this.color + "k"][0].coords;

		// king's x, king's y, king's color
		if(this.isKingChecked(convertRowsToIndex(kingCoords[1]), convertColsToIndex(kingCoords[0]), this.color)) {
			virtualBoard[x][y] = tempStorage;
			return true;
		} else {
			virtualBoard[x][y] = tempStorage;
			return false;
		}
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

	// diagonal checking
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
		this.pieceName = color + "r"
		this.hasMoved = 0;
	}

	move() {
		if (this.coords[0] == cellCoord[0] || this.coords[1] == cellCoord[1]) {  // checks if it is in the same row or column
			if(this.blockedHorizontal()) { return }  // if blocked horizontally, do nothing
			if(this.blockedVertical()) { return }  // if blocked vertically, do nothing

			this.movePiece();
			this.hasMoved = 1;
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
}

class Bishop extends Piece {
	constructor(color, coords) {
		super(color, coords);

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
	constructor(color, coords) {
		super(color, coords);

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
	constructor(color, coords) {
		super(color, coords);

		this.pieceName = color + "k";
		this.hasMoved = false;
	}

	eat() {
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
			this.hasMoved = true;
		}

		// castling for white king
		if(cur_y == 7 && this.color == 'w') {
			if(convertColsToIndex(cellCoord[0]) == 6 && rowsMoved == 0) {
				if(virtualBoard[7][5] == '' && virtualBoard[7][6] == '' && virtualBoard[7][7].pieceName == "wr") {
					if(this.hasMoved == false) {
						moveList.push("wk castled king side on turn " + (turn+1));
						this.movePiece();
						virtualBoard[7][5] = virtualBoard[7][7]; // move rook to new location
						virtualBoard[7][7] = ''; // delete old rook

						document.querySelector(`.${"wr"}.${"h1"}`).remove(); // removes piece from old square
						var p = document.createElement('div'); // makes a new div called p
						p.className = `${"wr"} ${"f1"}`; // puts the first part of pieceInfo and the cellCoord into the p's className
						document.getElementById("f1").appendChild(p); // puts the piece we created in js into the cell that we clicked on
					}
				}
			}

			if(convertColsToIndex(cellCoord[0]) == 1 && rowsMoved == 0) {
				if(virtualBoard[7][1] == '' && virtualBoard[7][2] == '' && virtualBoard[7][3] == '' && virtualBoard[7][0].pieceName == "wr") {
					if(this.hasMoved == false) {
						moveList.push("wk castled queen side on turn " + (turn+1));
						this.movePiece();
						virtualBoard[7][2] = virtualBoard[7][0]; // move rook to new location
						virtualBoard[7][0] = ''; // delete old rook

						document.querySelector(`.${"wr"}.${"a1"}`).remove(); // removes piece from old square
						var p = document.createElement('div'); // makes a new div called p
						p.className = `${"wr"} ${"c1"}`; // puts the first part of pieceInfo and the cellCoord into the p's className
						document.getElementById("c1").appendChild(p); // puts the piece we created in js into the cell that we clicked on
					}
				}
			}

		}

		// castling for the black king
		if(cur_y == 0 && this.color == 'b') {
			if(convertColsToIndex(cellCoord[0]) == 6 && rowsMoved == 0) {
				if(virtualBoard[0][5] == '' && virtualBoard[0][6] == '' && virtualBoard[0][7].pieceName == "br") {
					if(this.hasMoved == false) {
						moveList.push("bk castled king side on turn " + (turn+1));
						this.movePiece();
						virtualBoard[0][5] = virtualBoard[7][7]; // move rook to new location
						virtualBoard[0][7] = ''; // delete old rook

						document.querySelector(`.${"br"}.${"h8"}`).remove(); // removes piece from old square
						var p = document.createElement('div'); // makes a new div called p
						p.className = `${"br"} ${"f8"}`; // puts the first part of pieceInfo and the cellCoord into the p's className
						document.getElementById("f8").appendChild(p); // puts the piece we created in js into the cell that we clicked on
					}
				}
			}

			if(convertColsToIndex(cellCoord[0]) == 1 && rowsMoved == 0) {
				if(virtualBoard[0][1] == '' && virtualBoard[0][2] == '' && virtualBoard[0][3] == '' && virtualBoard[0][0].pieceName == "br") {
					if(this.hasMoved == false) {
						moveList.push("bk castled queen side on turn " + (turn+1));
						this.movePiece();
						virtualBoard[0][2] = virtualBoard[0][0]; // move rook to new location
						virtualBoard[0][0] = ''; // delete old rook

						document.querySelector(`.${"br"}.${"a8"}`).remove(); // removes piece from old square
						var p = document.createElement('div'); // makes a new div called p
						p.className = `${"br"} ${"c8"}`; // puts the first part of pieceInfo and the cellCoord into the p's className
						document.getElementById("c8").appendChild(p); // puts the piece we created in js into the cell that we clicked on
					}
				}
			}
		}
	}

	helperFunction(new_x, new_y, old_x, old_y) {
		var tempPiece = virtualBoard[new_x][new_y]
		virtualBoard[new_x][new_y] = virtualBoard[old_x][old_y]; // new virtual space = old virt space
		virtualBoard[old_x][old_y] = ''; // old virt space is set back to ''
		var result = this.isKingChecked(new_x, new_y, this.color);
		virtualBoard[old_x][old_y] = virtualBoard[new_x][new_y]; // cancels the move
		virtualBoard[new_x][new_y] = tempPiece;
		return result;
	}

	isCheckmated() {

		var king_x = convertRowsToIndex(this.coords[1]);
		var king_y = convertColsToIndex(this.coords[0]);

		if (!this.isKingChecked(king_x, king_y, this.color)) {
			return false;
		}

		// check if pieces are pinned

		var kingsPieces = Object.entries(pieces).filter(entry => (entry[0][0] == this.color) && (entry[0] !== this.color + "k")).flat().filter(item => typeof item !== "string").flat();

		// for(var i = 0; i<kingsPieces.length; i++) {
		// 	kingsPieces[i].isPinned();
		// 	console.log(kingsPieces);
		// }

		// need to do something with isPinned()

		for(var i = king_x - 1; i <= king_x + 1; i++) {
			for(var j = king_y - 1; j <= king_y + 1; j++) {
				if(i > 7 || i < 0 || j > 7 || j < 0) {
				}
				else if([i, j] !== [king_x, king_y] && virtualBoard[i][j].color == this.color) {
				}
				else if(this.helperFunction(i, j, king_x, king_y)) {
				}
				else {
					return false;
				}
			}
		}
		return true;
	}
}

class Knight extends Piece {
	constructor(color, coords) {
		super(color, coords);

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
	constructor(color, coords) {
		super(color, coords);
		this.enPassantPossible = false;
		this.pieceName = color + "p";
	}

	move() {

		let rowsMoved = convertRowsToIndex(this.coords[1]) - convertRowsToIndex(cellCoord[1]);
		let colsMoved = convertColsToIndex(this.coords[0]) - convertColsToIndex(cellCoord[0]);

		// PAWN DOUBLE MOVE
		if ((this.color == "w") && (rowsMoved == 1) && (colsMoved == 0) ||
				(this.color == "b") && (rowsMoved == -1) && (colsMoved == 0) ||
				(this.color == "w") && (this.coords[1] == "2") && (rowsMoved == 2) && (colsMoved == 0) ||
				(this.color == "b") && (this.coords[1] == "7") && (rowsMoved == -2) && (colsMoved == 0)) {

			this.movePiece();

			// CHECK IF EN PASSANT IS POSSIBLE FOR WHITE

			if(this.color == "b" && cellCoord[1] == "5") {
				if(convertColsToIndex(cellCoord[0]) >= 1) {
					var leftPiece = virtualBoard[3][convertColsToIndex(cellCoord[0])-1];
					if(leftPiece !== '' && leftPiece.pieceName == "wp") {
						leftPiece.enPassantPossible = true;
					}
				}

				if(convertColsToIndex(cellCoord[0]) <= 6) {
					var rightPiece = virtualBoard[3][convertColsToIndex(cellCoord[0])+1];
					if(rightPiece !== '' && rightPiece.pieceName == "wp") {
						rightPiece.enPassantPossible = true;
					}
				}
			}

			// CHECK IF EN PASSANT IS POSSIBLE FOR BLACK

			if(this.color == "w" && cellCoord[1] == "4") {
				if(convertColsToIndex(cellCoord[0]) >= 1) {
					var leftPiece = virtualBoard[4][convertColsToIndex(cellCoord[0])-1];
					if(leftPiece !== '' && leftPiece.pieceName == "bp") {
						leftPiece.enPassantPossible = true;
					}
				}

				if(convertColsToIndex(cellCoord[0]) <= 6) {
					var rightPiece = virtualBoard[4][convertColsToIndex(cellCoord[0])+1];
					if(rightPiece !== '' && rightPiece.pieceName == "bp") {
						rightPiece.enPassantPossible = true;
					}
				}
			}
			return;
		}

		// EN PASSANT - WHITE

		if(this.color == "w" && this.coords[1] == "5" && this.enPassantPossible == true) {

			var Y = parseInt(convertRowsToIndex(this.coords[1]));
			var X = parseInt(convertColsToIndex(this.coords[0]));

			if((X-1) > 0) {
				if(virtualBoard[Y][X-1].pieceName == "bp") {
					this.movePiece();
					virtualBoard[Y][X-1] = ''; // old virt space is set back to ''

					var capturedPieceInfo = convertIndexToCols(X-1) + (convertIndexToRows(Y)).toString()
					document.querySelector(`.${"bp"}.${capturedPieceInfo}`).remove(); // removes piece from old square
				}
			}

			if((X+1) < 7) {
				if(virtualBoard[Y][X+1].pieceName == "bp") {
					this.movePiece();
					virtualBoard[Y][X+1] = ''; // old virt space is set back to ''

					var capturedPieceInfo = convertIndexToCols(X+1) + (convertIndexToRows(Y)).toString()
					document.querySelector(`.${"bp"}.${capturedPieceInfo}`).remove(); // removes piece from old square
				}
			}
		}

		// EN PASSANT - BLACK
		else if (this.color == "b" && this.coords[1] == "4" && this.enPassantPossible == true) {

			var Y = parseInt(convertRowsToIndex(this.coords[1]));
			var X = parseInt(convertColsToIndex(this.coords[0]));

			if((X-1) > 0) {
				if(virtualBoard[Y][X-1].pieceName == "wp") {
					this.movePiece();
					virtualBoard[Y][X-1] = ''; // old virt space is set back to ''

					var capturedPieceInfo = convertIndexToCols(X-1) + (convertIndexToRows(Y)).toString()
					document.querySelector(`.${"wp"}.${capturedPieceInfo}`).remove(); // removes piece from old square
				}
			}

			if((X+1) < 7) {
				if(virtualBoard[Y][X+1].pieceName == "wp") {
					this.movePiece();
					virtualBoard[Y][X+1] = ''; // old virt space is set back to ''

					var capturedPieceInfo = convertIndexToCols(X+1) + (convertIndexToRows(Y)).toString()
					document.querySelector(`.${"wp"}.${capturedPieceInfo}`).remove(); // removes piece from old square
				}
			}
		}
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

		let cur_r = convertRowsToIndex(this.coords[1]);
		let cur_c = convertColsToIndex(this.coords[0]);

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
