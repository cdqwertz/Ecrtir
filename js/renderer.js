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
	core.gui.project_view.init(canvas_2);
}

function audio () {
	this.bpm = 60;

	this.audio_ctx = new AudioContext();
	this.gain = this.audio_ctx.createGain();
	this.gain.connect(this.audio_ctx.destination);
	this.gain.value = 0.5;

	this.play_note = function (note, time, duration) {
		console.log(note + " " + time + " " + duration);

		time = (60/this.bpm) * time / 64 + this.audio_ctx.currentTime;
		duration = (60/this.bpm) * duration / 64;

		console.log(note + " " + time + " " + duration);
		console.log(this);

		var oscillator = this.audio_ctx.createOscillator();
		oscillator.type = "square";
		oscillator.frequency.value = 440 * Math.pow(2, note / 12);
		oscillator.connect(this.audio_ctx.destination);

		oscillator.start (time);
		oscillator.stop(time+duration);
	};
}

var core = new function() {
	this.project = new project("");

	this.gui = {
		piano_roll : new piano_roll(),
		project_view : new project_view()
	};

	this.audio = new audio ();
}();
