const electron = require("electron")
const app = electron.app;
const browser = electron.BrowserWindow;

var window_main;

app.on("ready", function() {
	window_main = new electron.BrowserWindow({
		width : 1024,
		height : 720,
	})

	window_main.setMenu(null);
	window_main.loadURL("file://" +  __dirname + "/index.html");
})
