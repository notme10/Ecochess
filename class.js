/*
IMPORTNANT STUFF TO DO!!!
IN CLASS STUFF!
multiplayer
settings page
flip board around (in settings page?)

OUTSIDE OF CLASS STUFF!!!
replace pieces with animals
checkmate popup order
testing!
game thinks rook is still in the corner, even after castling

NEWLY FOUND BUGS!!!

*/

class Piece {
	constructor(color, coords) {
		this.color = color;
		this.coords = coords;
		this.hasMoved = 0;
		this.pinned = false;
		this.imgurl;
	}

	setCoord(coord) {
		this.coords = coord;
	}

	movePiece(captureMove) {
		// captureMove is only true only when the move function is called to eat a piece
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

		var pawns = pieces[this.color + "p"];
		if(pawns != undefined) {
			for(var i = 0; i<pawns.length; i++) {
				pawns[i].enPassantPossible	= false;
			}
		}

		turn++;

		if(moveList.length < turn) {
			if(captureMove == true) {
				moveList.push(this.pieceName + " on " + prv_coords + " captured a piece on turn "+ (turn));
			} else {
				moveList.push(this.pieceName + " moved from " + prv_coords + " to " + this.coords + " on turn " + (turn))
			}


			var newMove = document.createElement("div");
			newMove.classList += "move";
			newMove.innerText = moveList[moveList.length-1];
			document.querySelector("#movesBox").appendChild(newMove);
		}

		var thisTurnColor;
		var thisTurnKing;
		turn % 2 == 1 ? thisTurnColor = 'b' : thisTurnColor = "w";

		for(var i = 0; i < 8; i++) {
			thisTurnKing = pieces[`${thisTurnColor}k`][0];
			if(thisTurnKing) {
				break;
			}
		}

		if(thisTurnKing.isCheckmated()) {
			// alert("Checkmate");
			loser = thisTurnColor;
		}
		return true;
	}

	// CAPTURING
	eatPiece() {

		var previousPosition = this.coords;
		var x = convertRowsToIndex(cellCoord[1]);
		var y = convertColsToIndex(cellCoord[0]);

		var pieceToCapture = virtualBoard[x][y];
		capturedPieces.push(pieceToCapture);

		document.querySelector(".capturedPieces").innerHTML = '';
		capturedPieces.forEach(item => {
			var capturedPiece = document.createElement("div");
			var pieceImg = document.createElement("img");
			pieceImg.src = item.imgurl;
			capturedPiece.appendChild(pieceImg);
			capturedPiece.style.width = "75px";
			capturedPiece.style.height = "75px";
			pieceImg.style.width = "100%";
			pieceImg.style.height = "100%";
			document.querySelector(".capturedPieces").appendChild(capturedPiece);
		});


		var t = document.querySelector(`.${virtualBoard[x][y].pieceName}.${cellCoord}`)
		var q = t.className;
		t.remove();
		pieces[virtualBoard[x][y].pieceName] = pieces[virtualBoard[x][y].pieceName].filter(item => item.coords !== cellCoord);

		var tempPiece = virtualBoard[x][y];
		virtualBoard[x][y] = "";

		if(!this.movePiece(true)) {
			// if movePiece cancels, run this code

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

		this.movePiece(false);
	}

	checkWinner() {
		if(loser == "w") {
			alert("BLACK WINS!");
		} else if(loser == "b") {
			alert("WHITE WINS!");
		}
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

	willKingDie(new_x, new_y, old_x, old_y) {
		// temporarily move king from old x and y to new x and y
		// tests if king is out of check at that new x and y
		// if king is checked, return true, if king is not checked, return false
		// revert king to old x and y
		var kingCoords = pieces[this.color + "k"][0].coords;

		var tempPiece = virtualBoard[new_x][new_y]
		virtualBoard[new_x][new_y] = virtualBoard[old_x][old_y]; // new virtual space = old virt space
		virtualBoard[old_x][old_y] = ''; // old virt space is set back to ''
		if( virtualBoard[new_x][new_y].pieceName == this.color+"k") {
			var result = this.isKingChecked(new_x,new_y, this.color);
		} else {
			var result = this.isKingChecked(convertRowsToIndex(kingCoords[1]), convertColsToIndex(kingCoords[0]), this.color);
		}
		virtualBoard[old_x][old_y] = virtualBoard[new_x][new_y]; // cancels the move
		virtualBoard[new_x][new_y] = tempPiece;
		return result;
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

class Pawn extends Piece {
	constructor(color, coords) {
		super(color, coords);
		this.enPassantPossible = false;
		this.pieceName = color + "p";
		if(color == "w") {
			this.imgurl = "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wp.png";
		} else {
			this.imgurl = "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bp.png";
		}
	}

	move() {

		let rowsMoved = convertRowsToIndex(this.coords[1]) - convertRowsToIndex(cellCoord[1]);
		let colsMoved = convertColsToIndex(this.coords[0]) - convertColsToIndex(cellCoord[0]);

		// PAWN DOUBLE MOVE
		if ((this.color == "w") && (rowsMoved == 1) && (colsMoved == 0) ||
		(this.color == "b") && (rowsMoved == -1) && (colsMoved == 0) ||
		(this.color == "w") && (this.coords[1] == "2") && (rowsMoved == 2) && (colsMoved == 0) ||
		(this.color == "b") && (this.coords[1] == "7") && (rowsMoved == -2) && (colsMoved == 0)) {

			this.movePiece(false);

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

			if(((X-1) > 0) && (convertColsToIndex(cellCoord[0]) == (X-1))) {
				if(virtualBoard[Y][X-1].pieceName == "bp") {
					this.movePiece(false);
					moveList.push(this.color + "p used en passant to capture piece on " + (turn+1));

					var newMove = document.createElement("div");
					newMove.classList += "move";
					newMove.innerText = moveList[moveList.length-1];
					document.querySelector("#movesBox").appendChild(newMove);

					virtualBoard[Y][X-1] = ''; // old virt space is set back to ''

					var capturedPieceInfo = convertIndexToCols(X-1) + (convertIndexToRows(Y)).toString()
					document.querySelector(`.${"bp"}.${capturedPieceInfo}`).remove(); // removes piece from old square
				}
			}

			if(((X+1) < 7) && (convertColsToIndex(cellCoord[0]) == (X+1))) {
				if(virtualBoard[Y][X+1].pieceName == "bp") {
					this.movePiece(false);
					moveList.push(this.color + "p used en passant to capture piece on " + (turn+1));
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
					this.movePiece(false);
					moveList.push(this.color + "p used en passant to capture piece on " + (turn+1));
					virtualBoard[Y][X-1] = ''; // old virt space is set back to ''

					var capturedPieceInfo = convertIndexToCols(X-1) + (convertIndexToRows(Y)).toString()
					document.querySelector(`.${"wp"}.${capturedPieceInfo}`).remove(); // removes piece from old square
				}
			}

			if((X+1) < 7) {
				if(virtualBoard[Y][X+1].pieceName == "wp") {
					this.movePiece(false);
					moveList.push(this.color + "p used en passant to capture piece on " + (turn+1));
					virtualBoard[Y][X+1] = ''; // old virt space is set back to ''

					var capturedPieceInfo = convertIndexToCols(X+1) + (convertIndexToRows(Y)).toString()
					document.querySelector(`.${"wp"}.${capturedPieceInfo}`).remove(); // removes piece from old square
				}
			}
		}
		this.checkWinner();
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

	canAvoidCheckmate() {
		var pawn_row = convertRowsToIndex(this.coords[1]);
		var pawn_cols = convertColsToIndex(this.coords[0]);

		if(this.color == "w") {
			// white
			if((pawn_row < 7) && (virtualBoard[pawn_row + 1][pawn_cols] == '' || virtualBoard[pawn_row + 1][pawn_cols].color !== this.color)) {
				// if pawn_row + 1 does not go over 8 and if the piece in front of pawn is not empty or is a different color

				if(this.willKingDie(pawn_row+1, pawn_cols, pawn_row, pawn_cols) == false) {
					return true;
				}
			}
			if((pawn_row == 1) && (virtualBoard[pawn_row + 2][pawn_cols] == '' || virtualBoard[pawn_row + 2][pawn_cols].color !== this.color)) {
				// if pawn_row + 1 does not go over 8 and if the piece in front of pawn is not empty or is a different color
				if(this.willKingDie(pawn_row+2, pawn_cols, pawn_row, pawn_cols) == false) {
					return true;
				}
			}
		} else {
			// black
			if((pawn_row > 0) && (virtualBoard[pawn_row - 1][pawn_cols] == '' || virtualBoard[pawn_row - 1][pawn_cols].color !== this.color)) {
				// if pawn_row + 1 does not go over 8 and if the piece in front of pawn is not empty or is a different color
				if(this.willKingDie(pawn_row-1, pawn_cols, pawn_row, pawn_cols) == false) {
					return true;
				}
			}
			if((pawn_row == 6) && (virtualBoard[pawn_row - 2][pawn_cols] == '' || virtualBoard[pawn_row - 2][pawn_cols].color !== this.color)) {
				// if pawn_row + 1 does not go over 8 and if the piece in front of pawn is not empty or is a different color
				if(this.willKingDie(pawn_row-2, pawn_cols, pawn_row, pawn_cols) == false) {
					return true;
				}
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
		if(color == "w") {
			this.imgurl = "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wr.png";
		} else {
			this.imgurl = "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/br.png";
		}
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

class Knight extends Piece {
	constructor(color, coords) {
		super(color, coords);
		this.pieceName = color + "n";
		if(color == "w") {
			this.imgurl = "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wn.png";
		} else {
			this.imgurl = "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bn.png";
		}
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

		// FIXME: replace map with reduce
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

class Bishop extends Piece {
	constructor(color, coords) {
		super(color, coords);

		this.pieceName = color + "b";
		if(color == "w") {
			this.imgurl = "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wb.png";
		} else {
			this.imgurl = "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bb.png";
		}
	}

	move() {
		let rowsMoved = Math.abs(convertRowsToIndex(this.coords[1]) - convertRowsToIndex(cellCoord[1]));
		let colsMoved = Math.abs(convertColsToIndex(this.coords[0]) - convertColsToIndex(cellCoord[0]));

		if (rowsMoved == colsMoved) {
			if(this.blockedDiagonal()) { return }
			this.movePiece(false);
			this.checkWinner();
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

	canAvoidCheckmate() {
		var bishop_r = convertRowsToIndex(this.coords[1]);
		var bishop_c = convertColsToIndex(this.coords[0]);

		// bottom right
		for(var i = bishop_r + 1, j = bishop_c + 1; i<8 && j<8; i++, j++) {
			if(virtualBoard[i][j] != '' && virtualBoard[i][j].color == this.color) {
				// if test position is occupied by a piece of the same color, break
				break;
			}
			if(this.willKingDie(i, j, bishop_r, bishop_c) == false) {
				return true;
			}
			if(virtualBoard[i][j] != '' && virtualBoard[i][j].color != this.color) {
				break;
			}
		}

		// bottom left
		for(var i = bishop_r + 1, j = bishop_c - 1; i<8 && j>=0; i++, j--) {
			if(virtualBoard[i][j] != '' && virtualBoard[i][j].color == this.color) {
				// if test position is occupied by a piece of the same color, break
				break;
			}
			if(this.willKingDie(i, j, bishop_r, bishop_c) == false) {
				return true;
			}
			if(virtualBoard[i][j] != '' && virtualBoard[i][j].color != this.color) {
				break;
			}
		}

		// top right
		for(var i = bishop_r - 1, j = bishop_c + 1; i>=0 && j<8; i--, j++) {
			if(virtualBoard[i][j] != '' && virtualBoard[i][j].color == this.color) {
				// if test position is occupied by a piece of the same color, break
				break;
			}
			if(this.willKingDie(i, j, bishop_r, bishop_c) == false) {
				return true;
			}
			if(virtualBoard[i][j] != '' && virtualBoard[i][j].color != this.color) {
				break;
			}
		}

		// top left
		for(var i = bishop_r - 1, j = bishop_c - 1; i>=0 && j>=0; i--, j--) {
			if(virtualBoard[i][j] != '' && virtualBoard[i][j].color == this.color) {
				// if test position is occupied by a piece of the same color, break
				break;
			}
			if(this.willKingDie(i, j, bishop_r, bishop_c) == false) {
				return true;
			}
			if(virtualBoard[i][j] != '' && virtualBoard[i][j].color != this.color) {
				break;
			}
		}

		return false;
	}
}

class Queen extends Piece {
	constructor(color, coords) {
		super(color, coords);

		this.pieceName = color + "q";
		if(color == "w") {
			this.imgurl = "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wq.png";
		} else {
			this.imgurl = "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bq.png";
		}
	}

	move() {
		let rowsMoved = Math.abs(convertRowsToIndex(this.coords[1]) - convertRowsToIndex(cellCoord[1]));
		let colsMoved = Math.abs(convertColsToIndex(this.coords[0]) - convertColsToIndex(cellCoord[0]));

		if (rowsMoved == colsMoved || this.coords[0] == cellCoord[0] || this.coords[1] == cellCoord[1]) { // bishop + rook logic
			if(rowsMoved == colsMoved && this.blockedDiagonal()) { return }
			if(this.coords[1] == cellCoord[1] && this.blockedHorizontal()) { return }
			if(this.coords[0] == cellCoord[0] && this.blockedVertical()) { return }

			this.movePiece(false);
			this.checkWinner();
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

	canAvoidCheckmate() {
		var queen_row = convertRowsToIndex(this.coords[1]);
		var queen_col = convertColsToIndex(this.coords[0]);

		// right
		for(var i = queen_row + 1; i<8; i++) {
			if(virtualBoard[queen_row][i] != '' && virtualBoard[queen_row][i].color == this.color) {
				// if test position is occupied by a piece of the same color, break
				break;
			}
			if(this.willKingDie(queen_row, i, queen_row, queen_col) == false) {
				return true;
			}
			if(virtualBoard[queen_row][i] != '' && virtualBoard[queen_row][i].color != this.color) {
				break;
			}
		}

		// left
		for(var i = queen_col - 1; i>=0; i--) {
			if(virtualBoard[queen_row][i] != '' && virtualBoard[queen_row][i].color == this.color) {
				// if test position is occupied by a piece of the same color, break
				break;
			}
			if(this.willKingDie(queen_row, i, queen_row, queen_col) == false) {
				return true;
			}
			if(virtualBoard[queen_row][i] != '' && virtualBoard[queen_row][i].color != this.color) {
				break;
			}
		}

		// up
		for(var i = queen_row - 1; i>=0; i--) {
			if(virtualBoard[i][queen_col] != '' && virtualBoard[i][queen_col].color == this.color) {
				// if test position is occupied by a piece of the same color, break
				break;
			}
			if(this.willKingDie(i, queen_col, queen_row, queen_col) == false) {
				return true;
			}
			if(virtualBoard[i][queen_col] != '' && virtualBoard[i][queen_col].color != this.color) {
				break;
			}
		}

		// down
		for(var i = queen_row + 1; i<8; i++) {
			if(virtualBoard[i][queen_col] != '' && virtualBoard[i][queen_col].color == this.color) {
				// if test position is occupied by a piece of the same color, break
				break;
			}
			if(this.willKingDie(i, queen_col, queen_row, queen_col) == false) {
				return true;
			}
			if(virtualBoard[i][queen_col] != '' && virtualBoard[i][queen_col].color != this.color) {
				break;
			}
		}

		// bottom right
		for(var i = queen_row + 1, j = queen_col + 1; i<8 && j<8; i++, j++) {
			if(virtualBoard[i][j] != '' && virtualBoard[i][j].color == this.color) {
				// if test position is occupied by a piece of the same color, break
				break;
			}
			if(this.willKingDie(i, j, queen_row, queen_col) == false) {
				return true;
			}
			if(virtualBoard[i][j] != '' && virtualBoard[i][j].color != this.color) {
				break;
			}
		}

		// bottom left
		for(var i = queen_row + 1, j = queen_col - 1; i<8 && j>=0; i++, j--) {
			if(virtualBoard[i][j] != '' && virtualBoard[i][j].color == this.color) {
				// if test position is occupied by a piece of the same color, break
				break;
			}
			if(this.willKingDie(i, j, queen_row, queen_col) == false) {
				return true;
			}
			if(virtualBoard[i][j] != '' && virtualBoard[i][j].color != this.color) {
				break;
			}
		}

		// top right
		for(var i = queen_row - 1, j = queen_col + 1; i>=0 && j<8; i--, j++) {
			if(virtualBoard[i][j] != '' && virtualBoard[i][j].color == this.color) {
				// if test position is occupied by a piece of the same color, break
				break;
			}
			if(this.willKingDie(i, j, queen_row, queen_col) == false) {
				return true;
			}
			if(virtualBoard[i][j] != '' && virtualBoard[i][j].color != this.color) {
				break;
			}
		}

		// top left
		for(var i = queen_row - 1, j = queen_col - 1; i>=0 && j>=0; i--, j--) {
			if(virtualBoard[i][j] != '' && virtualBoard[i][j].color == this.color) {
				// if test position is occupied by a piece of the same color, break
				break;
			}
			if(this.willKingDie(i, j, queen_row, queen_col) == false) {
				return true;
			}
			if(virtualBoard[i][j] != '' && virtualBoard[i][j].color != this.color) {
				break;
			}
		}
		return false;
	}

}

class King extends Piece {
	constructor(color, coords) {
		super(color, coords);

		this.pieceName = color + "k";
		this.hasMoved = false;
		if(color == "w") {
			this.imgurl = "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wk.png";
		} else {
			this.imgurl = "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bk.png";
		}
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
		var isThreatened = this.isKingChecked(cur_y, cur_x, this.color);
		let rowsMoved = Math.abs(cur_y - convertRowsToIndex(cellCoord[1]));
		let colsMoved = Math.abs(cur_x - convertColsToIndex(cellCoord[0]));

		if (rowsMoved <= 1 && colsMoved <= 1) {
			this.movePiece(false);
			this.hasMoved = true;
		}

		if(isThreatened == false) {
			// castling for white king
			if(cur_y == 7 && this.color == 'w') {
				if(convertColsToIndex(cellCoord[0]) == 6 && rowsMoved == 0) {
					if(virtualBoard[7][5] == '' && virtualBoard[7][6] == '' && virtualBoard[7][7].pieceName == "wr") {
						if(this.hasMoved == false) {
							if(this.isKingChecked("7", "6", "w") == false) {
								moveList.push("wk castled king side on turn " + (turn+1));
								var newMove = document.createElement("div");
								newMove.classList += "move";
								newMove.innerText = moveList[moveList.length-1];
								document.querySelector("#movesBox").appendChild(newMove);
								this.movePiece(false);
								virtualBoard[7][5] = virtualBoard[7][7]; // move rook to new location
								virtualBoard[7][7] = ''; // delete old rook

								document.querySelector(`.${"wr"}.${"h1"}`).remove(); // removes piece from old square
								var p = document.createElement('div'); // makes a new div called p
								p.className = `${"wr"} ${"f1"}`; // puts the first part of pieceInfo and the cellCoord into the p's className
								document.getElementById("f1").appendChild(p); // puts the piece we created in js into the cell that we clicked on
							}
						}
					}
				}

				if(convertColsToIndex(cellCoord[0]) == 1 && rowsMoved == 0) {
					if(virtualBoard[7][1] == '' && virtualBoard[7][2] == '' && virtualBoard[7][3] == '' && virtualBoard[7][0].pieceName == "wr") {
						if(this.hasMoved == false) {
							if(this.isKingChecked("7", "1", "w") == false) {
								moveList.push("wk castled queen side on turn " + (turn+1));
								var newMove = document.createElement("div");
								newMove.classList += "move";
								newMove.innerText = moveList[moveList.length-1];
								document.querySelector("#movesBox").appendChild(newMove);
								this.movePiece(false);
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
			}

			// castling for the black king
			if(cur_y == 0 && this.color == 'b') {
				if(convertColsToIndex(cellCoord[0]) == 6 && rowsMoved == 0) {
					if(virtualBoard[0][5] == '' && virtualBoard[0][6] == '' && virtualBoard[0][7].pieceName == "br") {
						if(this.hasMoved == false) {
							if(this.isKingChecked("0", "6", "b") == false) {
								moveList.push("bk castled king side on turn " + (turn+1));
								this.movePiece(false);
								virtualBoard[0][5] = virtualBoard[7][7]; // move rook to new location
								virtualBoard[0][7] = ''; // delete old rook

								document.querySelector(`.${"br"}.${"h8"}`).remove(); // removes piece from old square
								var p = document.createElement('div'); // makes a new div called p
								p.className = `${"br"} ${"f8"}`; // puts the first part of pieceInfo and the cellCoord into the p's className
								document.getElementById("f8").appendChild(p); // puts the piece we created in js into the cell that we clicked on
							}
						}
					}
				}

				if(convertColsToIndex(cellCoord[0]) == 1 && rowsMoved == 0) {
					if(virtualBoard[0][1] == '' && virtualBoard[0][2] == '' && virtualBoard[0][3] == '' && virtualBoard[0][0].pieceName == "br") {
						if(this.hasMoved == false) {
							if(this.isKingChecked("0", "1", "b") == false) {
								moveList.push("bk castled queen side on turn " + (turn+1));
								this.movePiece(false);
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
		}
		this.checkWinner();
	}

	canAvoidCheckmate() {
		// checks eight squares around King and moves king to each one temporarily
		// checks if king is out of check at that spot
		// returns true if king can get out of check
		// return false if king is in checkmate

		var king_x = convertRowsToIndex(this.coords[1]);
		var king_y = convertColsToIndex(this.coords[0]);

		for(var i = king_x - 1; i <= king_x + 1; i++) {
			for(var j = king_y - 1; j <= king_y + 1; j++) {
				if(i > 7 || i < 0 || j > 7 || j < 0) {
				}
				else if([i, j] !== [king_x, king_y] && virtualBoard[i][j].color == this.color) {
				}
				else if(this.willKingDie(i, j, king_x, king_y) == false) {
					return true;
				}
			}
		}
		return false;
	}

	isCheckmated() {

		var king_x = convertRowsToIndex(this.coords[1]);
		var king_y = convertColsToIndex(this.coords[0]);

		if (!this.isKingChecked(king_x, king_y, this.color)) {
			return false;
		}

		// check if pieces are pinned

		var kingsPieces = Object.entries(pieces).filter(entry => (entry[0][0] == this.color) && (entry[0] !== this.color + "k")).flat().filter(item => typeof item !== "string").flat();

		for(var i = 0; i<8; i++) {
			for (var j = 0; j<8; j++) {
				if(virtualBoard[i][j] !== '' && virtualBoard[i][j].color == this.color) {
					if(virtualBoard[i][j].canAvoidCheckmate() == true) {
						return false;
					}
				}
			}
		}

		return true;
	}
}
