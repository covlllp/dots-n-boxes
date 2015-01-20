var game = "";

$(document).ready(function() {
	// $(window).keypress(function(e) {
	// 	if (game.whoseTurn() == 'comp') {
	// 		var test = setInterval(function() {
	// 			game.playComputerTurn();
	// 			if (game.whoseTurn() == 'player' || game.isGameEnd()) {
	// 				clearInterval(test);
	// 			}
	// 		},500);
	// 	}
	// });

	$(".line").on("click", function() {
		if (game.whoseTurn() == 'player') {
			game.playLine(this);
		} else return;
		if (game.whoseTurn() == 'comp') {
			var test = setInterval(function() {
				game.playComputerTurn();
				if (game.whoseTurn() == 'player' || game.isGameEnd()) {
					clearInterval(test);
				}
			},400);
		}
	});

	$("#play-button").on("click", function() {
		game = new Game();
		$(this).text("Replay Game");
	});
});

function Game() {
	var scores         = {player: 0, comp: 0};
	var turn           = 'player';		// 'player' or 'comp'
	var blockMap       = this.init2dArray(4, DOT_DEPTH, DOT_WIDTH); // indicates how many sides of a block have been played
	var goodMoves      = [];			// keeps track of moves that will close boxes
	var badMoves       = [];			// keeps track of moves to avoid
	var availableMoves = this.initAvailMoves();			// keeps track of all other available moves

	// DOM getting reset
	$("#player-turn").removeClass("hidden");
	$("#comp-turn").addClass("hidden");
	$(".line").removeClass("player-back");
	$(".line").removeClass("comp-back");
	$(".box").removeClass("player-back");
	$(".box").removeClass("comp-back");
	updateScores();

	// Testing functions
	this.printSidesLeft = function() {
		for (var i = 0; i < blockMap.length; i++) {
			for (var j = 0; j < blockMap[i].length; j++) {
				$("#b" + i + "-" + j).text(blockMap[i][j]);
			}
		}
	}
	// this.printSidesLeft();


	// Private functions
	function moveLinesTo(i, j, arrToMoveTo) {
		var arr = [];
		removeLineFrom(i, j, i + 1, j, arr);
		removeLineFrom(i, j, i, j + 1, arr);
		removeLineFrom(i, j + 1, i + 1, j + 1, arr);
		removeLineFrom(i + 1, j, i + 1, j + 1, arr);
		arrToMoveTo.push.apply(arrToMoveTo, arr);
	}

	function removeMove(id) {
		// Returns true if object was removed, false if no object found
		// QUESTION ABOUT THIS.
		var a = Game.prototype.removeIdFromArr(goodMoves, id);
		var b = Game.prototype.removeIdFromArr(badMoves, id);
		var c = Game.prototype.removeIdFromArr(availableMoves, id);
		return a || b || c;
	}

	function removeLineFrom(i, j, k, l, arr) {
		var lineID = "ld" + i + "-" + j + "_d" + k + "-" + l;
		if (removeMove(lineID)) arr.push(lineID)
	}

	function updateScores() {
		$("#user_score").text(scores.player);
		$("#comp_score").text(scores.comp);
	}

	function isMoveAvailable(id) {
		return (goodMoves.indexOf(id) 	  != -1
			|| badMoves.indexOf(id)       != -1
			|| availableMoves.indexOf(id) != -1);
	}

	function updateBoxAndMoves(i, j) {
		if (i >= 0 && j >= 0 && i < DOT_DEPTH && j < DOT_WIDTH) {
			if (--blockMap[i][j] == 0) {
				$("#b" + i + "-" + j).addClass(turn + "-back");
				scores[turn]++;
				updateScores();
				return false;
			} else if (blockMap[i][j] == 1) {
				moveLinesTo(i, j, goodMoves);
			} else if (blockMap[i][j] == 2) {
				moveLinesTo(i, j, badMoves);
			}
		}
		return true;
	}

	function updateAndReturn(dom, id) {
		var dash_ind = id.indexOf("-");
		var under_ind = id.indexOf("_");
		var i = parseInt(id.substring(2, dash_ind));
		var j = parseInt(id.substring(dash_ind + 1, under_ind));
		if ($(dom).hasClass("vert-line")) {
			var a = updateBoxAndMoves(i, j);
			var b = updateBoxAndMoves(i, j - 1);
			return a && b;
		} else if ($(dom).hasClass("horiz-line")) {
			var a = updateBoxAndMoves(i, j);
			var b = updateBoxAndMoves(i - 1, j);
			return a && b;
		}
	}

	// Privileged functions
	this.playLine = function(dom) {
		var id = $(dom).attr('id');
		if (isMoveAvailable(id)) {
			$(dom).addClass(turn + "-back");
			if (updateAndReturn(dom, id)) {
				this.switchTurn();
			}
			removeMove(id);
			// this.printSidesLeft();
		}
	}

	this.switchTurn = function() {
		$("#" + turn + "-turn").toggleClass("hidden");
		turn = (turn == 'player') ? 'comp' : 'player';
		$("#" + turn + "-turn").toggleClass("hidden");
	}

	this.whoseTurn = function() {
		return turn;
	}

	this.playComputerTurn = function() {
		this.playFromArr(goodMoves)
		&& this.playFromArr(availableMoves)
		&& this.playFromArr(badMoves);
	}

	this.isGameEnd = function() {
		return !(goodMoves.length + badMoves.length + availableMoves.length);
	}
}



// Game public prototype functions
Game.prototype.playFromArr = function(arr) {
	var len = arr.length;
	if (!len) return true;
	var ind = Math.floor(Math.random() * len);
	this.playLine($("#" + arr[ind]));
	return false;
};

Game.prototype.removeIdFromArr = function(arr, id) {
	var ind = arr.indexOf(id);
	if (ind != -1) {
		arr.splice(ind, 1);
		return true;
	} else return false;
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

Game.prototype.init2dArray = function(init, m, n) {
	// var arr = new Array(m);
	var arr = [];
	for (var i = 0; i < m; i++) {
		// arr[i] = new Array(n);
		arr[i] = [];
		for (var j = 0; j < n; j++) {
			arr[i][j] = init;
		}
	}
	return arr;
};