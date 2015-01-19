var game;

$(document).ready(function() {
	$(".box").on("click", function() {
		$(this).addClass("comp-back");
	});
	$(".line").on("click", function() {
		$(this).addClass("player-back");
	})
	$(window).keypress(function(e) {
		console.log("in");
		$("#b0-0").addClass("player-back");
	})
})