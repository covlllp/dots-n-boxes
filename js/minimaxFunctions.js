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
	while (new Date() - now < 0.9 * COMP_SPEED) {
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
	this.playLine(lineId);
	this.curNode = this.curNode[lineId];
	console.log(curNode);
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

Node.prototype.getBoardUtil = function() {
	var util = 0;

	for (var i = 0; i < this.board.length; i++) {
		for (var j = 0; j < this.board[i].length; j++) {
			if (this.board[i][j] == 0) util--;
			else if (this.board[i][j] == -1) util++;
		}
	}
	return util;
};

Node.prototype.analyzeChildren = function() {
	var self = this;
	this.availMoves.forEach(function(lineId) {
		var availMoves = self.availMoves.slice();
		availMoves.splice(availMoves.indexOf(lineId), 1);
		var board = MultiDepArrayClone(self.board);
		var value = self.getBoardUtil(board);
		var turn = self.turn;
		if (Game.prototype.playLineOnBoard(lineId, board, self.turn)) {
			turn = (turn == 'player') ? 'comp' : 'player';
		}
		self[lineId] = new Node(lineId, self, availMoves, board, turn, value);

		if ((turn == 'comp' && value > self.value) ||
		(turn == 'player' && value < self.value))
			self.value = value;
	});
};

Node.prototype.bubbleUpTo = function(topNode) {
	if (this == topNode) return;

	var parent = this.parent;
	if ((parent.turn == 'comp' && this.value > parent.value) ||
	(parent.turn == 'player' && this.value < parent.value)) {
		parent.value = this.value;
		parent.bubbleUpTo(topNode);
	}
};

Node.prototype.selectMove = function() {
	var self = this;
	var moves = [];
	this.availMoves.forEach(function(lineId) {
		if (self.value == self[lineId].value) moves.push(lineId);
	});
	return moves[Math.floor(Math.random() * moves.length)]
};