$(document).ready(function() {
	$(".box").on("click", function() {
		$(this).addClass("good");
	});
	$(".line").on("click", function() {
		$(this).addClass("line-show");
	})
})