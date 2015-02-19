var game;

$(document).ready(function() {
	$(window).keypress(function(e) {});

	$(".line").on("click", function() {
		if (game.getCurrentBrain() != 'player') {
			return;
		}
		game.playLine($(this).attr('id'));
		game.continueComputerTurns();
	});

	$("#play-button").on("click", function() {
		game = new Game();
	});
});



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