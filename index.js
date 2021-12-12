var argv = require("minimist")(process.argv.slice(2));
const fs = require("fs");
const gifLength = 30;
const childProcesses = 16;
const width = 1080;
const height = 1297;
if (process.argv[2] == "child") {
	var i = process.argv[3];
	var then = Date.now();
	require("./createImage")(width, height, callback, gifLength);
	function callback(path) {
		var dir = "./test/" + path;
		var files = fs.readdirSync(dir);
		if (files.length != gifLength + 2) {
			try {
				fs.unlinkSync(dir);
			} catch (error) {
				console.log("Error: Images not complete for " + path);
			}
		} else {
			var now = Date.now();
			var date = (now - then) / 1000;
			console.log("done in " + date + "seconds");
		}
	}
} else {
	console.log("Starting Processes");
	const cp = require("child_process");

	for (var i = 0; i < childProcesses; i++) {
		startChild(i);
	}
	function startChild(i) {
		console.log("hello!");
		var child = cp.fork(__filename, ["child", i], {
			stdio: ["inherit", "inherit", "inherit", "ipc"],
		});
		child.on("error", (e) => {
			console.log(e);
		});
	}
}
