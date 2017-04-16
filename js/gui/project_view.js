function project_view () {
	this.pattern = 0;
	this.cursor = 10;
	this.cursor_snap = 0.2;
	this.w = 128;
	this.h = 64;

	this.drag = {
		last_x : -1,
		last_y : -1,
		active : false
	};

	this.viewport = {
		x : 0,
		y : 0
	};

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
		var y = e.pageY - window.innerHeight/2;
		var p = core.gui.project_view;

		if(e.which == 1) {
			x -= p.viewport.x;
			y -= p.viewport.y;

			var my_pattern = Math.floor(y/p.h);

			if(x > p.w) {
				var beat = Math.floor((x-p.w)/p.w);

				if(my_pattern > core.project.track.data.length-1) {
					core.project.track.data.push([]);
					my_pattern = core.project.track.data.length-1;

					core.project.patterns.push(new pattern(null, 1, []))
				}

				var len = core.project.patterns[my_pattern].length;
				var a = false;
				var b = 0;

				var pattern_data = core.project.track.data[my_pattern];
				for(var it = 0; it < pattern_data.length; it++){
					if(pattern_data[it] <= beat && beat < pattern_data[it] + len) {
						a = true;
						b = it;
						break;
					}
				}

				if (!a) {
					core.project.track.data[my_pattern].push(beat);
				} else {
					core.project.track.data[my_pattern].splice(b, 1);
				}
			} else {
				if(my_pattern > core.project.track.data.length-1) {
					core.project.track.data.push([]);
					my_pattern = core.project.track.data.length-1;

					core.project.patterns.push(new pattern(null, 1, []))
				}

				core.gui.piano_roll.pattern = my_pattern;
				core.gui.piano_roll.draw();
			}
		} else if (e.which == 2) {
			p.drag.active = true;
			p.drag.last_x = x;
			p.drag.last_y = y;
		}

		p.draw();
	};

	this.mousemove = function (e) {
		var x = e.pageX;
		var y = e.pageY - window.innerHeight/2;
		var p = core.gui.project_view;

		if(p.drag.active) {
			p.viewport.x += x - p.drag.last_x;
			p.viewport.y += y - p.drag.last_y;

			p.viewport.x = Math.min(p.viewport.x, 0);
			p.viewport.y = Math.min(p.viewport.y, 0);

			p.drag.last_x = x;
			p.drag.last_y = y;
		}

		x -= p.viewport.x;
		y -= p.viewport.y;

		if (x >= p.w) {
			p.cursor = Math.round(x/p.w/p.cursor_snap) * p.cursor_snap;
		} else {
			p.cursor = 1;
		}

		p.draw();
	};

	this.mouseup = function (e, pass) {
		var x = e.pageX;
		var y = e.pageY - window.innerHeight/2;
		var p = core.gui.project_view;

		if(p.drag.active) {
			p.drag.active = false;
		}

		if(pass != false) {
			core.gui.piano_roll.mouseup(e, false);
		}

		p.draw();
	};

	this.draw = function () {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.ctx.translate(this.viewport.x, 0);

		with(this.ctx) {
			strokeStyle = "#334";
			beginPath();
			moveTo(0, 0);
			lineTo(this.canvas.width, 0);
			stroke();

			fillStyle = "#292930";
			fillRect(0, 0, this.w, this.canvas.height);
		}

		var track = core.project.track;

		for(var i = 1; i < track.length+1; i++) {
			with(this.ctx) {
				strokeStyle = "#334";
				beginPath();
				moveTo(i*this.w, 0);
				lineTo(i*this.w, this.canvas.height);
				stroke();
			}
		}

		this.ctx.translate(0, this.viewport.y);

		for(var i = 0; i < track.data.length; i++) {
			var my_pattern = track.data[i];

			for(var j = 0; j < my_pattern.length; j++) {
				var x = this.w*(my_pattern[j] + 1);
				var y = this.h*i;

				this.ctx.fillStyle = "#33aaaa";
				this.ctx.fillRect(x, y, this.w*core.project.patterns[i].length-1, this.h);
			}

			with(this.ctx) {
				strokeStyle = "#334";
				beginPath();
				moveTo(0, (i+1)*this.h);
				lineTo(this.canvas.width, (i+1)*this.h);
				stroke();
			}
		}

		this.ctx.translate(0, -this.viewport.y);

		with(this.ctx) {
			strokeStyle = "#a22";
			beginPath();
			moveTo(this.cursor*this.w, 0);
			lineTo(this.cursor*this.w, this.canvas.height);
			stroke();
		}

		this.ctx.translate(-this.viewport.x, 0);
	};
}
