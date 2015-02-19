// Drawing functions

Game.prototype.drawLine = function(lineId) {
	$('#' + lineId).addClass(this.turn + '-back');
};

Game.prototype.drawBox = function(i, j) {
	$('#b' + i + '-' + j).addClass(this.turn + '-back');
};


// Gameplay functions

Game.prototype.whoseTurn = function() {
	return this.turn;
};

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
	$("#" + this.turn + "-turn").toggleClass("hidden");
	this.turn = (this.turn == 'player') ? 'comp' : 'player';
	$("#" + this.turn + "-turn").toggleClass("hidden");
};


