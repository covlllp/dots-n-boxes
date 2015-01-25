var game;

$(document).ready(function() {
	game = new Game();

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
		// 		if (game.whoseTurn() == 'player' || game.isGameEnd()) {
		// 			clearInterval(test);
		// 		}
		// 	},500);
		// }


		while (game.whoseTurn() == 'comp' && !game.isGameEnd()) {
			game.playComputerTurn();
		}
	});

	$("#play-button").on("click", function() {
		game = new Game();
	});
});

function Game() {
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
	$("#play-button").text("Replay Game");
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

	// old
	// function moveLinesTo(i, j, arrToMoveTo) {
	// 	var arr = [];
	// 	removeLineFrom(i, j, i + 1, j, arr);
	// 	removeLineFrom(i, j, i, j + 1, arr);
	// 	removeLineFrom(i, j + 1, i + 1, j + 1, arr);
	// 	removeLineFrom(i + 1, j, i + 1, j + 1, arr);
	// 	arrToMoveTo.push.apply(arrToMoveTo, arr);
	// }

	// old
	// function removeLineFrom(i, j, k, l, arr) {
	// 	var lineID = "ld" + i + "-" + j + "_d" + k + "-" + l;
	// 	if (removeMove(lineID)) arr.push(lineID)
	// }

	function updateScores() {
		$("#user_score").text(scores.player);
		$("#comp_score").text(scores.comp);
	}

	function isMoveAvailable(id) {
		return availMoves.indexOf(id) != -1;
	}

	// old
	// function updateBoxAndMoves(i, j) {
	// 	if (i >= 0 && j >= 0 && i < DOT_DEPTH && j < DOT_WIDTH) {
	// 		if (--blockMap[i][j] == 0) {
	// 			$("#b" + i + "-" + j).addClass(turn + "-back");
	// 			if (turn == 'comp') blockMap[i][j]--;
	// 			scores[turn]++;
	// 			updateScores();
	// 			return false;
	// 		} else if (blockMap[i][j] == 1) {
	// 			moveLinesTo(i, j, goodMoves);
	// 		} else if (blockMap[i][j] == 2) {
	// 			moveLinesTo(i, j, badMoves);
	// 		}
	// 	}
	// 	return true;
	// }

	// old
	// function playFromArr(arr) {
	// 	var len = arr.length;
	// 	if (!len) return true;
	// 	var ind = Math.floor(Math.random() * len);
	// 	this.playLine($("#" + arr[ind]));
	// 	availMoves.splice(availMoves.indexOf(arr[ind]), 1);
	// 	return false;
	// };

	function attemptMoveWithSides (sides) {
		var coord = getBoardCoord(sides);
		if (!coord) return true;
		var id = availBoardSide(coord, sides);
		this.playLine(id);
		return false;
	}

	function getBoardCoord (sides) {
		// function checkNeighborBlocks (i, j, sides) {
		// 	var min = sides.min();
		// 	console.log(sides);
		// 	console.log(min);
		// 	function checkBlock(x, y) {
		// 		if (x >= 0 && y >= 0
		// 			&& x < blockMap.length && y < blockMap[x].length)
		// 			return blockMap[x][y] >= min;
		// 		else return true;
		// 	}

		// 	return checkBlock(i, j-1) && checkBlock(i, j+1)
		// 	&& checkBlock(i-1, j) && checkBlock(i+1, j);
		// }

		var foundCoords = [];
		for (var i = 0; i < blockMap.length; i++) {
			for (var j = 0; j < blockMap[i].length; j++) {
				if (sides.indexOf(blockMap[i][j]) != -1
					&& checkNeighborBlocks(i, j, sides))
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
				arr.push(lineId);
			}
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
			attemptMoveWithSides.call(this, [1])
			&& attemptMoveWithSides.call(this, [3, 4])
			&& attemptMoveWithSides.call(this, [2]);
			// playFromArr.call(this, goodMoves)
			// && playFromArr.call(this, okayMoves)
			// && playFromArr.call(this, badMoves);
		} else {
			var now = new Date();
			var count = 0;
			while (new Date() - now < COMP_SPEED) {
			// while (new Date() - now < 20) {
				var leafNode = this.bubbleDown(curNode, 0);
				var utilVal = this.getBoardUtil(leafNode.boardState, leafNode.turn);
				var merge = [];
				this.bubbleUp(leafNode, curNode, utilVal);
				count++;
			}
			console.log('count:', count);
			var pick = this.selectPick(curNode);
			var m = [];
			console.log(m.concat.apply(m,curNode[pick].boardState));
			this.playLine(pick);
		}
	}

	this.isGameEnd = function() {
		return !(availMoves.length);
	}
}



// Game public prototype functions

Game.prototype.updateMapAndReturn = function(id, map, turn, state) {
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

Game.prototype.updateMapOffIndices = function(map, turn, i, j, k, state) {
	var a, b;
	a = this.updateBox(map, turn, i, j, state);
	if (i == k) {	// line is horizontal
		b = this.updateBox(map, turn, i - 1, j, state);
	} else {		// line is vertical
		b = this.updateBox(map, turn, i, j - 1, state);
	}
	return a + b;
};

Game.prototype.updateBox = function(map, turn, i, j, state) {
	if (i >= 0 && j >= 0 && i < map.length && j < map[i].length) {
		if (--map[i][j] == 0) {
			if (state == 'real') $("#b" + i + "-" + j).addClass(turn + "-back");
			if (turn == 'comp') map[i][j]--;
			return 1;
		}
	}
	return 0;
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
	var arr = [];
	for (var i = 0; i < m; i++) {
		arr[i] = [];
		for (var j = 0; j < n; j++) {
			arr[i][j] = init;
		}
	}
	return arr;
};

Game.prototype.compBrain = function() {
	return $("input:radio:checked")[0].value.toLowerCase();
};

Game.prototype.bubbleDown = function(node, count) {
	if (count >= MCTS_DEPTH) return node; // return node!
	else if (node.availMoves.length == 0) return node;

	var pickInd = Math.floor(Math.random() * node.availMoves.length);
	var pick = node.availMoves[pickInd];

	if (node.hasOwnProperty[pick]) return this.bubbleDown(node[pick], ++count); // bubble down

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

Game.prototype.bubbleUp = function(node, curNode, utilVal) {
	if (node == curNode) return;
	node.utilVal = (node.utilVal * node.num_visit + utilVal) / (++node.num_visit);
	this.bubbleUp(node.parent, curNode, node.utilVal);
};

Game.prototype.selectPick = function(node) {
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


Game.prototype.getBoardUtil = function(board, turn) {
	var score = 0;
	var mult = (turn == 'comp') ? -1 : 1;
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[i].length; j++) {
			if (board[i][j] == -1) score += 2;
			else if (board[i][j] == 0) score -= 2;
			else if (board[i][j] == 1) score += 0.75 * mult;
			else if (board[i][j] == 2) score -= 0.5 * mult;
		};
	};
	// var flatBoard = [].concat.apply([], arr);
	// score += 2 * mult * flatBoard.filter(function(val) {return val == -1}).length;
	// score -= 2 * mult * flatBoard.filter(function(val) {return val == 0}).length;
	// score += 0.75 * mult * flatBoard.filter(function(val) {return val == 1}).length;
	// score += 0.5 * mult * flatBoard.filter(function(val) {return val == 2}).length;
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