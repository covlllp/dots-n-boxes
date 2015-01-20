var game;

$(document).ready(function() {
	// $(".box").on("click", function() {
	// 	$(this).addClass("comp-back");
	// });

	$(".line").on("click", function() {
		game.playLine(this);
	});

	$(window).keypress(function(e) {
		console.log("in");
		$("#b0-0").addClass("player-back");
	});

	$("#play-button").on("click", function() {
		game = new Game();
	})
});

function Game() {
	var player_score   = 0;
	var comp_score     = 0;
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

	// Private functions
	function isMoveAvailable(id) {
		return (goodMoves.indexOf(id) != -1
			|| badMoves.indexOf(id) != -1
			|| availableMoves.indexOf(id) != -1);
	}

	function removeMove(id) {
		// QUESTION ABOUT THIS.
		Game.prototype.removeIdFromArr(goodMoves, id);
		Game.prototype.removeIdFromArr(badMoves, id);
		Game.prototype.removeIdFromArr(availableMoves, id);
	}

	function updateAndReturn(id) {
		
	}

	// Privileged functions
	this.playLine = function(dom) {
		var id = $(dom).attr('id');
		if (isMoveAvailable(id)) {
			$(dom).addClass(turn + "-back");
			
			if (updateAndReturn(id)) {
				this.switchTurn();
			}


			removeMove(id);
		}
	}

	this.switchTurn = function() {
		$("#" + turn + "-turn").toggleClass("hidden");
		turn = (turn == 'player') ? 'comp' : 'player';
		$("#" + turn + "-turn").toggleClass("hidden");
	}
}

// Game public prototype functions
Game.prototype.removeIdFromArr = function(arr, id) {
	var ind = arr.indexOf(id);
	if (ind != -1) arr.slice(ind, 1);
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