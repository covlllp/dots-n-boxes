// Computer functions

Game.prototype.continueComputerTurns = function() {
	if (this.getCurrentBrain() != 'player' && !this.isGameOver()) {
		var self = this;
		var playTurn = setInterval(function() {
			self.playComputerTurn();
			if (self.getCurrentBrain() == 'player' || self.isGameOver()) {
				clearInterval(playTurn);
			}
		}, COMP_SPEED);
	}
};

Game.prototype.playComputerTurn = function() {
	var compBrain = this.getCurrentBrain();
	if (compBrain == 'random') {
		this.playRandom();
	} else if (compBrain == 'greedy') {
		this.playGreedy();
	} else if (compBrain == 'minimax') {
		this.playMinimax();
	}
};

Game.prototype.playMinimax = function() {
	this.runMinimax(this.curNode);
};

Game.prototype.playGreedy = function() {
	this.playMoveWithNumSides(1) &&
	this.playMoveWithNumSides(3, 4) &&
	this.playMoveWithNumSides(2);
};


Game.prototype.playRandom = function() {
	this.playLine(
		this.availMoves[
			Math.floor(Math.random() * this.availMoves.length)
		]
	);
};

Game.prototype.getCurrentBrain = function() {
	return this.getBrain(this.whoseTurn());
};

Game.prototype.getBrain = function(who) {
	return $('#' + who + '-brain > input:radio:checked')[0].value.toLowerCase();
};

Game.prototype.playMoveWithNumSides = function() { // args can be multiple sides
	// returns false if move played, true otherwise
	var sides = [].slice.call(arguments);
	var blocks = this.getAvailBlocksWithNumSides(sides);
	while (blocks.length) {
		var block = blocks.splice(Math.floor(Math.random() * blocks.length), 1);
		var lines = this.availLinesFromBlockWithSides(sides, block[0].i, block[0].j);
		if (lines.length) {
			this.playLine(lines[Math.floor(Math.random() * lines.length)]);
			return false;
		}
	}
	return true;
};

Game.prototype.getAvailBlocksWithNumSides = function(side_arr) {
	var self = this;
	return this.LoopBoardAndReturn(function(i, j) {
		return side_arr.indexOf(self.board[i][j]) != -1;
	});
};

Game.prototype.availLinesFromBlockWithSides = function(sides, i, j) {
	var arr = [];
	var self = this;

	function addAvailLine (i, j, k, l) {
		var lineId = getLineName(i, j, k, l);
		if (self.availMoves.indexOf(lineId) != -1) {
			if (checkBlock(i, j) && 
				((i==k) ? checkBlock(i-1, j) : checkBlock(i, j-1))) {
				arr.push(lineId);
			}
		}
	}

	function checkBlock (i, j) {
		if (self.checkBoxBounds(i, j)) return self.board[i][j] >= sides.min();
		else return true;
	}

	addAvailLine(i, j, i + 1, j);
	addAvailLine(i, j, i, j + 1);
	addAvailLine(i + 1, j, i + 1, j + 1);
	addAvailLine(i, j + 1, i + 1, j + 1);
	return arr;
};
