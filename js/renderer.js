var canvas_1;
var canvas_2;

function load() {
	canvas_1 = document.getElementById("canvas_1");
	canvas_2 = document.getElementById("canvas_2");

	var w = window.innerWidth;
	var h = window.innerHeight;

	canvas_1.width = w;
	canvas_1.height = h/2-40;

	canvas_2.width = w;
	canvas_2.height = h/2;

	core.gui.piano_roll.init(canvas_1);
}

var core = new function() {
	this.project = new project("");

	this.gui = {
		piano_roll : new piano_roll(),
		track_view : null
	}
}();
