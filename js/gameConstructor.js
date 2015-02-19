function Game () {
	this.scores = {player: 0, comp: 0};
	this.turn = 'player';
	this.board = this.init2dArray(4, DOT_DEPTH - 1, DOT_WIDTH - 1);
	this.availMoves = this.initAvailMoves();
	this.curNode = new Node(null, null, this.availMoves, this.board, this.turn, 0);

	// Reset the DOM
	$("#player-turn").removeClass("hidden");
	$("#comp-turn").addClass("hidden");
	$(".line, .box").removeClass("player-back");
	$(".line, .box").removeClass("comp-back");
	$("#play-button").text("Restart Game");
	this.updateScores();
	// this.printSidesLeft();

	// Play computer turn if needed
	this.continueComputerTurns();
}

// Board iteration functions
Game.prototype.LoopBoardAndReturn = function(func) {
	var arr = [];
	for (var i = 0; i < this.board.length; i++) {
		for (var j = 0; j < this.board[i].length; j++) {
			if (func(i, j)) {
				arr.push({i: i, j: j});
			}
		}
	}
	return arr;
};


// Initation functions
Game.prototype.init2dArray = function(initVal, m, n) {
	var arr = [];
	for (var i = 0; i < m; i++) {
		arr[i] = [];
		for (var j = 0; j < n; j++) {
			arr[i][j] = initVal;
		}
	}
	return arr;
};

Game.prototype.initAvailMoves = function() {
	var arr = [];
	for (var i = 0; i < DOT_DEPTH; i++) {
		for (var j = 0; j < DOT_WIDTH; j++) {
			if (i < DOT_DEPTH - 1)
				arr.push(getLineName(i, j, i + 1, j));
			if (j < DOT_WIDTH - 1)
				arr.push(getLineName(i, j, i, j + 1));
		}
	}
	return arr;
};


// Testing functions
Game.prototype.printSidesLeft = function() {
	for (var i = 0; i < this.board.length; i++) {
		for (var j = 0; j < this.board[i].length; j++) {
			$("#b" + i + "-" + j).text(this.board[i][j]);
		}
	}
};


