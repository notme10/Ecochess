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

	checkedOrCheckmated() {
		var kingCoords = pieces[this.color + "k"][0].coords;
		if(this.color == "w") {
			var opponentColor = "b";
		} else {
			var opponentColor = "w";
		}
		return this.isKingChecked(kingCoords[0], kingCoords[1], opponentColor);
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
		var prevCoords = this.coords[0] + prevRow;

		if((pieceInfo[0] == this.color + "p") && (pieceInfo[1][1] == prevRow) && (rowNow == curRow)) { // if pawn is at the 7th or 2nd row
			var promotionPiece;

			// something to check if the promoting piece color is the same as the player's color
			if((side === "w" && turn%2===0) || (side === "b" && turn%2===1)) {
				// show modal

				let promotionModal =
				document.getElementById("promotionTemplate")
				.content.firstElementChild;
				document.body.appendChild(promotionModal);

				let promotionChoices = document.getElementsByClassName("promotionItem");
				for (i = 0; i<promotionChoices.length; i++) {
					promotionChoices[i].addEventListener("click", e=> {
						console.log(rowNow);
						this.promote(e.target.getAttribute("piece"), rowNow, colNow, prv_coords, captureMove);
						promotionModal.remove();
					});
				}
			}
			else {
				this.promote(enemyPromotion, rowNow, colNow, prv_coords, captureMove);
			}
			return;
		}

		else { // normal move
			var p = document.createElement('div'); // makes a new div called p

			p.className = `${pieceInfo[0]} ${cellCoord} ${pieceIdentifier(side, pieceInfo[0])}`; // puts the first part of pieceInfo and the cellCoord into the p's className
			document.getElementById(cellCoord).appendChild(p); // puts the piece we created in js into the cell that we clicked on
		}

		var pawns = pieces[this.color + "p"];
		if(pawns != undefined) {
			for(var i = 0; i<pawns.length; i++) {
				pawns[i].enPassantPossible	= false;
			}
		}
		this.endTurn(prv_coords, captureMove);
		return true;
	}

	endTurn(prv_coords, captureMove) {
		turn++;

		var newPosTxt = this.coords;
		var displayText = `${this.pieceName}.${prv_coords}.${this.coords}`;
		if(captureMove == true) { displayText += ".x" }

		var oppColor = this.color=="w" ? "b" : "w";
		var kingCoords = pieces[oppColor + "k"][0].coords;

		if(this.isKingChecked(convertRowsToIndex(kingCoords[1]), convertColsToIndex(kingCoords[0]), oppColor)) {
			displayText += ".+";
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
			displayText += ".#";
		}

		if(moveList.length < turn) {
			moveList.push({pieceName: this.pieceName,
				oldPos: prv_coords,
				newPos: newPosTxt,
				color: this.color,
				captured: captureMove,
				threatened: this.checkedOrCheckmated(),
				display: `${this.pieceName}.${prv_coords}.${this.coords}`
			});
			pushMoveMessage();
		}

		socket.emit("makeMove", {moves: moveList[moveList.length - 1], room:room, pieces: pieces, turn: turn});

		var newTurnMessage = '';
		if((turn%2 == 0 && side == "w") || (turn%2 == 1 && side == "b")) {
			newTurnMessage = "my turn";
		} else {
			newTurnMessage = "opponent's turn";
		}

		document.getElementById("messageBoard").innerText = newTurnMessage;

		if(thisTurnKing.isCheckmated()) {
			loser = thisTurnColor;
			console.log(loser);

		}
		return true;
	}

	// CAPTURING
	eatPiece() {

		var previousPosition = this.coords;
		var x = convertRowsToIndex(cellCoord[1]);
		var y = convertColsToIndex(cellCoord[0]);
		var pieceToCapture = virtualBoard[x][y];

		var t = document.querySelector(`.${virtualBoard[x][y].pieceName}.${cellCoord}`)
		var q = t.className;
		t.remove();
		pieces[virtualBoard[x][y].pieceName] = pieces[virtualBoard[x][y].pieceName].filter(item => item.coords !== cellCoord);

		var tempPiece = virtualBoard[x][y];
		virtualBoard[x][y] = "";

		if(!this.movePiece(true, true)) {
			// if movePiece cancels, run this code

			virtualBoard[x][y] = tempPiece;
			var p = document.createElement('div'); // makes a new div called p
			p.className = q; // puts the first part of pieceInfo and the cellCoord into the p's className
			document.getElementById(cellCoord).appendChild(p); // puts the piece we created in js into the cell that we clicked on
		} else {
			console.log("has a piece been eaten");
			capturedPieces.push(pieceToCapture);
			var item = capturedPieces[capturedPieces.length - 1];
			if(side !== item.color) {
				var capturedPiece = document.createElement("div");
				capturedPiece.className = 'e'+item.pieceName[1];
				capturedPiece.style.width = "75px";
				capturedPiece.style.height = "75px";
				document.getElementById("capturedPieces").appendChild(capturedPiece);
			}
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

	winnerAlert() {
		if(loser == "w") {
			alert("Black wins! Please disconnect. ");
		} else if(loser == "b") {
			alert("White wins! Please disconnect. ");
		}
	}

	checkWinner() {
		setTimeout(this.winnerAlert, 10);
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
// export default Piece;
