function pattern (instrument, length, data) {
	this.instrument = instrument;
	this.length = length;
	this.data = data || [];

	this.play = function(s) {
		console.log("Hi");
		for (var i = 0; i < this.data.length; i++) {
			core.audio.play_note(this.data[i][0], this.data[i][1]+s, this.data[i][2]);
		}
	}
}

function project (name) {
	this.name = name;

	this.patterns = [new pattern(null, 2, [])];
	this.track = {
		length : 8,
		data : [[0, 2, 4]]
	};

	this.play = function () {
		for (var i = 0; i < this.track.data.length; i++) {
			for (var j = 0; j < this.track.data[i].length; j++) {
				this.patterns[i].play(this.track.data[i][j]*64);
			}
		}
	};
}
