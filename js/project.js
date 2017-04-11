function pattern (instrument, length, data) {
	this.instrument = instrument;
	this.length = length;
	this.data = data || [];
}

function project (name) {
	this.name = name;

	this.patterns = [new pattern(null, 2, [])];
	this.track = {
		length : 8,
		data : [[0, 2, 4]]
	};
}
