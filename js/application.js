var Game = require('game');
var game;

$(document).ready(function() {
	$(window).keypress(function(e) {
		// game.playComputerTurn();
		// console.log($("input:radio:checked")[0].value);
	});

	$(".line").on("click", function() {
		if (game.whoseTurn() == 'player') {
			game.playLine($(this).attr('id'));
		} else return;
		// if (game.whoseTurn() == 'comp') {
		// 	var test = setInterval(function() {
		// 		game.playComputerTurn();
		// 		if (game.whoseTurn() == 'player' || game.isOld_GameEnd()) {
		// 			clearInterval(test);
		// 		}
		// 	},500);
		// }


		while (game.whoseTurn() == 'comp' && !game.isOld_GameEnd()) {
			game.playComputerTurn();
		}
	});

	$("#play-button").on("click", function() {
		game = new Game();
	});
});



function Game () {
	this.scores = {player: 0, comp: 0};
	this.turn = 'player';
	this.board = this.init2dArray(4, DOT_DEPTH - 1, DOT_WIDTH - 1);
	this.availMoves = this.initAvailMoves();

	// Reset the DOM
	$("#player-turn").removeClass("hidden");
	$("#comp-turn").addClass("hidden");
	$(".line, .box").removeClass("player-back");
	$(".line, .box").removeClass("comp-back");
	$("#play-button").text("Restart Game");
	updateScores();
}


// Board functions

Game.prototype.playLine = function(lineId) {
	// Should return # of boxes completed.
};


Game.prototype.actOnLine = function(lineId, func) {
	// Takes function and runs on blocks
	var lineInds = this.parseLineInd(lineId);
	
};

Game.prototype.checkBoxBounds = function(i, j) {
	return (x >= 0 && y >= 0
		&& x < DOT_WIDTH - 1 && y < DOT_DEPTH - 1)
};

Game.prototype.parseLineInd = function(lineId) {
	var arr = [];
	var dash_ind = lineId.indexOf('-');
	var under_ind = lineId.indexOf('_');
	var other_dash_ind = lineId.indexOf('-', under_ind);
	arr.push(lineId.substring(2, dash_ind) * 1);
	arr.push(lineId.substring(dash_ind + 1, under_ind) * 1);
	arr.push(lineId.substring(under_ind + 2, other_dash_ind) * 1);
	arr.push(lineId.substring(other_dash_ind + 1, lineId.length) * 1);
	return arr;
};

// Gameplay functions

Game.prototype.isMoveAvailable = function(lineId) {
	return this.availMoves.indexOf(lineId) != -1;
};

Game.prototype.isGameOver = function() {
	return this.availMoves.length == 0;
};

Game.prototype.updateScores = function() {
	$("#user_score").text(this.scores.player);
	$("#comp_score").text(this.scores.comp);
};

Game.prototype.switchTurn = function() {
	($"#" + this.turn + "-turn").toggleClass("hidden");
	this.turn = (this.turn == player) ? 'comp' : 'player';
	($"#" + this.turn + "-turn").toggleClass("hidden");
};




// Initation functions
Game.prototype.init2dArray = function(initVal, m, n) {
	var arr = [];
	for (var i = 0; i < m; i++) {
		arr[i] = [];
		for (var j = 0; j < n; j++) {
			arr[i][j] = initVal;
		};
	};
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






function Old_Game() {
	var scores    = {player: 0, comp: 0};
	var turn      = 'player';				// 'player' or 'comp'
	var blockMap  = this.init2dArray(4, DOT_DEPTH - 1, DOT_WIDTH - 1);
											// indicates how many sides of a block have been played
											//		if 0, player point
											//		if -1, computer point
	var availMoves= this.initAvailMoves();	// all available moves
	var curNode = new Node(null, null, availMoves, blockMap, turn);
											// pointer to current node

	// DOM getting reset
	$("#player-turn").removeClass("hidden");
	$("#comp-turn").addClass("hidden");
	$(".line").removeClass("player-back");
	$(".line").removeClass("comp-back");
	$(".box").removeClass("player-back");
	$(".box").removeClass("comp-back");
	$("#play-button").text("Replay Old_Game");
	updateScores();

	// Testing functions
	this.printSidesLeft = function() {
		for (var i = 0; i < blockMap.length; i++) {
			for (var j = 0; j < blockMap[i].length; j++) {
				$("#b" + i + "-" + j).text(blockMap[i][j]);
			}
		}
	}
	this.printSidesLeft();


	// Private functions

	function updateScores() {
		$("#user_score").text(scores.player);
		$("#comp_score").text(scores.comp);
	}

	function isMoveAvailable(id) {
		return availMoves.indexOf(id) != -1;
	}

	function attemptMoveWithSides (sides) {
		var coord = getBoardCoord(sides);
		if (!coord) return true;
		var id = availBoardSide(coord, sides);
		this.playLine(id);
		return false;
	}

	function getBoardCoord (sides) {
		var foundCoords = [];
		for (var i = 0; i < blockMap.length; i++) {
			for (var j = 0; j < blockMap[i].length; j++) {
				if (sides.indexOf(blockMap[i][j]) != -1)
					foundCoords.push({i: i, j: j});
			};
		};

		if (foundCoords.length == 0) return false;
		return foundCoords[Math.floor(Math.random() * foundCoords.length)];
	}

	function availBoardSide (coord, sides) {
		function addAvailLine(arr, i, j, k, l) {
			var lineId = getLineName(i, j, k, l);
			if (availMoves.indexOf(lineId) != -1) {
				if (checkBlock(i,j) && ((i==k && checkBlock(i, j-1))
								 || (j==l && checkBlock(i-1, j)))) {
					arr.push(lineId);
				}
			}
		}

		function checkBlock (x, y) {
			// return true if either out of bounds or side is larger than min
			var bounds = Old_Game.prototype.checkBoxBounds(x, y);
			if (bounds) return blockMap[x][y] >= sides.min();
			else return true;
		}

		var availSideIDs = [];
		addAvailLine(availSideIDs, coord.i, coord.j, coord.i+1, coord.j);
		addAvailLine(availSideIDs, coord.i, coord.j, coord.i, coord.j+1);
		addAvailLine(availSideIDs, coord.i+1, coord.j, coord.i+1, coord.j+1);
		addAvailLine(availSideIDs, coord.i, coord.j+1, coord.i+1, coord.j+1);
		return availSideIDs[Math.floor(Math.random() * availSideIDs.length)];
	}




	// Privileged functions
	this.playLine = function(id) {
		var dom = $('#' + id)[0];
		if (isMoveAvailable(id)) {
			$(dom).addClass(turn + "-back");
			var score = this.updateMapAndReturn(id, blockMap, turn, 'real')
			if (score) {
				scores[turn] += score;
				updateScores();
			} else {
				this.switchTurn();
			}
			this.removeIdFromArr(availMoves, id);
			this.printSidesLeft();
			if (curNode.hasOwnProperty(id)) curNode = curNode[id];
			else curNode = new Node(id, curNode, availMoves, blockMap, turn);
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
		if (this.compBrain() == 'greedy') {
			// run greedy algorithm
			attemptMoveWithSides.call(this, [1])
			&& attemptMoveWithSides.call(this, [3, 4])
			&& attemptMoveWithSides.call(this, [2]);
		} else {
			// run monte carlo test search algorithm
			var now = new Date();
			var count = 0;
			while (new Date() - now < COMP_SPEED) {
			// while (count < 10) {
					var leafNode = this.bubbleDown(curNode, 0);
				var utilVal = this.getBoardUtil(leafNode.boardState, leafNode.turn);
				this.bubbleUp(leafNode, curNode, utilVal);
				count++;
			}
			console.log('count:', count);
			var pick = this.selectPick(curNode);
			console.log('curnode is ', curNode);
			console.log('pick is', pick);
			this.playLine(pick);
		}
	}

	this.isOld_GameEnd = function() {
		return !(availMoves.length);
	}
}



// Old_Game public prototype functions
Old_Game.prototype.checkBoxBounds = function(x, y) {
	return (x >= 0 && y >= 0
		&& x < DOT_WIDTH - 1 && y < DOT_DEPTH - 1)
};

Old_Game.prototype.updateMapAndReturn = function(id, map, turn, state) {
	// returns false if box is completed, true if not.
	// alters boolMap in place.
	var dash_ind = id.indexOf("-");
	var under_ind = id.indexOf("_");
	var other_dash_ind = id.indexOf("-", under_ind);

	var i = id.substring(2, dash_ind) * 1;
	var j = id.substring(dash_ind + 1, under_ind) * 1;
	var k = id.substring(under_ind + 2, other_dash_ind) * 1;

	return this.updateMapOffIndices(map, turn, i, j, k, state);
};

Old_Game.prototype.updateMapOffIndices = function(map, turn, i, j, k, state) {
	var a, b;
	a = this.updateBox(map, turn, i, j, state);
	if (i == k) {	// line is horizontal
		b = this.updateBox(map, turn, i - 1, j, state);
	} else {		// line is vertical
		b = this.updateBox(map, turn, i, j - 1, state);
	}
	return a + b;
};

Old_Game.prototype.updateBox = function(map, turn, i, j, state) {
	if (i >= 0 && j >= 0 && i < map.length && j < map[i].length) {
		if (--map[i][j] == 0) {
			if (state == 'real') $("#b" + i + "-" + j).addClass(turn + "-back");
			if (turn == 'comp') map[i][j]--;
			return 1;
		}
	}
	return 0;
};

Old_Game.prototype.removeIdFromArr = function(arr, id) {
	var ind = arr.indexOf(id);
	if (ind != -1) {
		arr.splice(ind, 1);
		return true;
	} else return false;
};


Old_Game.prototype.initAvailMoves = function() {
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

Old_Game.prototype.init2dArray = function(init, m, n) {
	var arr = [];
	for (var i = 0; i < m; i++) {
		arr[i] = [];
		for (var j = 0; j < n; j++) {
			arr[i][j] = init;
		}
	}
	return arr;
};

Old_Game.prototype.compBrain = function() {
	return $("input:radio:checked")[0].value.toLowerCase();
};

Old_Game.prototype.bubbleDown = function(node, count) {
	if (count >= MCTS_DEPTH) return node; // return node!
	else if (node.availMoves.length == 0) return node;

	var pickInd = Math.floor(Math.random() * node.availMoves.length);
	var pick = node.availMoves[pickInd];

	if (node.hasOwnProperty(pick)) return this.bubbleDown(node[pick], ++count); // bubble down

	var newBoard = MultiDepArrayClone(node.boardState);
	var availMoves = node.availMoves.slice();
	this.removeIdFromArr(availMoves, pick);
	this.printSidesLeft();

	var turn;
	if (this.updateMapAndReturn(pick, newBoard, node.turn, 'not-real'))
		turn = node.turn;
	else turn = (node.turn == 'player') ? 'comp' : 'player';
	this.printSidesLeft();
	var newNode = new Node(pick, node, availMoves, newBoard, turn);
	node[pick] = newNode;
	return this.bubbleDown(newNode, ++count);
};

Old_Game.prototype.bubbleUp = function(node, curNode, utilVal) {
	if (node == curNode) return;
	node.utilVal = (node.utilVal * node.num_visit + utilVal) / (node.num_visit + 1);
	node.num_visit++;
	this.bubbleUp(node.parent, curNode, node.utilVal);
};

Old_Game.prototype.selectPick = function(node) {
	var pick;
	var pick_val = -Infinity;
	for (var i = 0; i < node.availMoves.length; i++) {
		var temp_pick = node.availMoves[i];
		if (node.hasOwnProperty(temp_pick)) {
			if (node[temp_pick].utilVal > pick_val) {
				pick = temp_pick;
				pick_val = node[temp_pick].utilVal;
			}
		}
	};
	console.log('pick util:', pick_val);
	return pick;
};


Old_Game.prototype.getBoardUtil = function(board, turn) {
	var score = 0;
	var mult = (turn == 'comp') ? 1 : -1;
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[i].length; j++) {
			if (board[i][j] == -1) score += 3;
			else if (board[i][j] == 0) score -= 3;
			else if (board[i][j] == 1) score += 3 * mult;
			else if (board[i][j] == 2) score -= 0.5 * mult;
		};
	};
	return score;
};



function Node(move, parent, children, boardState, turn) {
	this.move = move;
	this.parent = parent;
	this.availMoves = children;
	this.boardState = boardState;
	this.utilVal = 0;
	this.num_visit = 0;
	this.turn = turn;
}

Array.prototype.min = function() {
	return Math.min.apply(null, this);
};

Array.prototype.max = function() {
	return Math.max.apply(null, this);
};

function MultiDepArrayClone (arr) {
	var newArr = arr.map(function(inner_arr) {
		return inner_arr.slice();
	});
	return newArr;
}