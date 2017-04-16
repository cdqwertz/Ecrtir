const electron = require("electron");
const remote = electron.remote;

document.onkeydown = function(event) {
	console.log(event.which);
	if (event.which == 123) {
		remote.getCurrentWindow().toggleDevTools();
	} else {
		
	}
}
