function piano_roll () {
	this.pattern = 0;
	this.cursor = 10;
	this.cursor_snap = 4;
	this.w = 4;
	this.h = 20;

	this.selection = {
		active : false,
		note_type : 0,
		note_time : 0,
		note_duration : 0,
		h : 0,
		type : 0
	}

	this.init = function (canvas) {
		this.canvas = canvas;
		this.ctx = this.canvas.getContext("2d");

		this.canvas.onmousedown = this.mousedown;
		this.canvas.onmousemove = this.mousemove;
		this.canvas.onmouseup = this.mouseup;

		this.draw();
	};

	this.mousedown = function (e) {
		var x = e.pageX;
		var y = e.pageY - 40;
		var p = core.gui.piano_roll;

		p.selection.active = true;
		p.selection.note_time = Math.round(x/p.w/p.cursor_snap) * p.cursor_snap;
		p.selection.note_type = Math.floor(y/p.h);
		p.selection.note_duration = 0;

		if(e.which == 1) {
			p.selection.type = 0;
		} else {
			p.selection.type = 1;
		}

		p.draw();
	};

	this.mousemove = function (e) {
		var x = e.pageX;
		var y = e.pageY - 40;
		var p = core.gui.piano_roll;

		if(p.selection.active) {
			p.selection.note_duration = Math.round(x/p.w/p.cursor_snap) * p.cursor_snap - p.selection.note_time;

			if(p.selection.type == 1) {
				p.selection.h = Math.ceil(y/p.h) - p.selection.note_type;
			}
		}

		p.cursor = Math.round(x/p.w/p.cursor_snap) * p.cursor_snap;
		p.draw();
	};

	this.mouseup = function (e) {
		var x = e.pageX;
		var y = e.pageY - 40;
		var p = core.gui.piano_roll;

		p.selection.active = false;
		p.selection.note_duration = Math.round(x/p.w/p.cursor_snap) * p.cursor_snap - p.selection.note_time;

		if(p.selection.type == 1) {
			p.selection.h = Math.ceil(y/p.h) - p.selection.note_type;

			if(p.selection.h < 0) {
				p.selection.note_type = p.selection.note_type + p.selection.h;
				p.selection.h *= -1;
			}
		}

		if(p.selection.note_duration < 0) {
			p.selection.note_time = p.selection.note_time + p.selection.note_duration;
			p.selection.note_duration *= -1;
		}

		if(p.selection.type == 0) {
			core.project.patterns[p.pattern].data.push([p.selection.note_type, p.selection.note_time, p.selection.note_duration]);
		} else if(p.selection.type == 1) {
			var data = core.project.patterns[p.pattern].data;
			var i = 0;
			while (i < data.length) {
				var note = data[i];
				if(note[0] >= p.selection.note_type && note[0] <= p.selection.note_type+p.selection.h) {
					if(note[1] < p.selection.note_duration+p.selection.note_time &&
						note[1]+note[2] > p.selection.note_time) {
						data.splice(i, 1);
						i--;
					}
				}
				i++;
			}
		}

		p.draw();
	};

	this.draw = function () {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		var pattern = core.project.patterns[this.pattern];
		for(var i = 0; i < pattern.data.length; i++) {
			var note = pattern.data[i];
			var note_type = note[0];
			var note_time = note[1];
			var note_duration = note[2];

			var x = this.w*note_time;
			var y = this.h*note_type;

			this.ctx.fillStyle = "#33aa22";
			this.ctx.fillRect(x, y, this.w*note_duration, this.h);
		}

		if (this.selection.active) {
			if(this.selection.type == 0) {
				this.ctx.fillStyle = "#66cc44";
				var s = this.selection;
				var x = this.w*s.note_time;
				var y = this.h*s.note_type;
				this.ctx.fillRect(x, y, this.w*s.note_duration, this.h);
			} else if (this.selection.type == 1) {
				this.ctx.fillStyle = "#cc6644";
				var s = this.selection;
				var x = this.w*s.note_time;
				var y = this.h*s.note_type;
				this.ctx.fillRect(x, y, this.w*s.note_duration, this.h*this.selection.h);
			}
		}

		for(var i = 1; i < pattern.length*4+1; i++) {
			var x = i*16;
			with(this.ctx) {
				strokeStyle = "#555";
				beginPath();
				moveTo(x*this.w, 0);
				lineTo(x*this.w, this.canvas.height);
				stroke();
			}
		}

		for(var i = 1; i < pattern.length+1; i++) {
			var x = i*64;
			with(this.ctx) {
				strokeStyle = "#999";
				beginPath();
				moveTo(x*this.w, 0);
				lineTo(x*this.w, this.canvas.height);
				stroke();
			}
		}

		with(this.ctx) {
			strokeStyle = "#a22";
			beginPath();
			moveTo(this.cursor*this.w, 0);
			lineTo(this.cursor*this.w, this.canvas.height);
			stroke();
		}
	};
}
