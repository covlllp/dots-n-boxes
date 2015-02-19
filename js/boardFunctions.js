// Board functions

Game.prototype.playLine = function(lineId) {
	this.drawLine(lineId);
	var self = this;
	var count = 0;
	this.actOnLine(lineId, function(i, j) {
		if (!--self.board[i][j]) {
			self.drawBox(i, j);
			count++;
			if (self.turn == 'comp') {
				self.board[i][j]--;
				self.scores.comp++;
			} else self.scores.player++;
			self.updateScores();
		}
	});
	if (!count) this.switchTurn();
	this.availMoves.splice(this.availMoves.indexOf(lineId), 1);
	// this.printSidesLeft();
};




Game.prototype.actOnLine = function(lineId, func) {
	var self = this;
	// Takes function and runs on blocks
	// Function takes block i and j
	function checkAndRun (i, j) {
		if (self.checkBoxBounds(i, j))
			func(i, j);	
	}

	var lineInds = this.parseLineInd(lineId);
	var i = lineInds[0];
	var j = lineInds[1];
	var k = lineInds[2];
	checkAndRun(i, j);
	if (i == k) checkAndRun(i - 1, j);	// horizontal line
	else checkAndRun(i, j - 1);			// vertical line
};

Game.prototype.checkBoxBounds = function(i, j) {
	return (j >= 0 && i >= 0 && j < DOT_WIDTH - 1 && i < DOT_DEPTH - 1);
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