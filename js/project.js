function pattern (instrument, length, data) {
	this.instrument = instrument;
	this.length = length;
	this.data = data || [];
}

function project (name) {
	this.name = name;

	this.patterns = [new pattern(null, 2, [[0, 0, 64], [1, 64, 64]])];
	this.track = {
		length : 4,
		data : []
	};
}
