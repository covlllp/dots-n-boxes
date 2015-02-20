Game.prototype.playLineOnBoard = function(lineId, board, turn) {
	// returns true if box is completed
	flag = false;
	this.actOnLine(lineId, function(i, j) {
		if (!--board[i][j]) {
			flag = true;
			if (turn == 'comp') {
				board[i][j]--;
			}
		}
	});
	return flag;
};

Game.prototype.runMinimax = function(curNode) {
	var now = new Date();
	var queue = [curNode];
	while (new Date() - now < 0.9 * COMP_SPEED && queue.length) {
		// debugger;
		var node = queue.shift();
		if (!node.areChildrenAnalyzed) {
			node.analyzeChildren();
			node.bubbleUpTo(curNode);
		}
		node.availMoves.forEach(function(move) {
			queue.push(node[move]);
		});
	}
	var lineId = curNode.selectMove();
	console.log('move is ', lineId);
	console.log('node object: ', this.curNode);
	this.playLine(lineId);
};


function Node(move, parent, availMoves, board, turn, value) {
	this.move = move;					// lineId of move that led to this
	this.parent = parent;				// reference to parent node
	this.availMoves = availMoves;		// array of available moves
	this.board = board;					// double array of current board state after this.move was played
	this.turn = turn;					// Current turn after this.move was played
	this.value = value;					// minimax value currently
	this.areChildrenAnalyzed = false;	// flag indicating that all children have been analyzed
}

Node.prototype.getBoardUtil = function(board) {
	var util = 0;

	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[i].length; j++) {
			if (board[i][j] == 0) {
				util--;
				console.log('in');
			} else if (board[i][j] == -1) util++;
		}
	}
	return util;
};

Node.prototype.analyzeChildren = function() {
	var self = this;
	if (this.availMoves.length)
		this.value = (this.turn == 'comp') ? -Infinity : Infinity;

	this.availMoves.forEach(function(lineId) {
		var availMoves = self.availMoves.slice();
		availMoves.splice(availMoves.indexOf(lineId), 1);
		// if (availMoves.length == 0) debugger;
		var board = MultiDepArrayClone(self.board);
		var turn = (self.turn == 'player') ? 'comp' : 'player';
		if (Game.prototype.playLineOnBoard(lineId, board, self.turn)) {
			turn = self.turn;
		}
		var value = self.getBoardUtil(board);
		self[lineId] = new Node(lineId, self, availMoves, board, turn, value);

		if ((self.turn == 'comp' && value > self.value) ||
		(self.turn == 'player' && value < self.value))
			self.value = value;
	});
	this.areChildrenAnalyzed = true;
};

Node.prototype.bubbleUpTo = function(topNode) {
	var self = this;
	var temp_val = (this.turn == 'comp') ? -Infinity : Infinity;
	this.availMoves.forEach(function(lineId) {
		if (self.hasOwnProperty(lineId)) {
			var node = self[lineId];
			if ((self.turn == 'comp' && node.value > temp_val) ||
			(self.turn == 'player' && node.value < temp_val)) {
				temp_val = node.value;	
			}
		}
	});
	if (temp_val == this.value) return;
	else {
		this.value = temp_val;
		if (this != topNode) this.parent.bubbleUpTo(topNode);
	}
	// var parent = this.parent;
	// if ((parent.turn == 'comp' && this.value > parent.value) ||
	// (parent.turn == 'player' && this.value < parent.value)) {
	// 	parent.value = this.value;
	// 	parent.bubbleUpTo(topNode);
	// }

	// if (this == topNode) return;
};

Node.prototype.selectMove = function() {
	var self = this;
	var moves = [];
	this.availMoves.forEach(function(lineId) {
		if (self.value == self[lineId].value) moves.push(lineId);
	});
	return moves[Math.floor(Math.random() * moves.length)];
};