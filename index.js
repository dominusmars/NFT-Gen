var argv = require("minimist")(process.argv.slice(2));
const fs = require("fs");

if (process.argv[2] == "child") {
	var i = process.argv[3];
	var then = Date.now();
	require("./createImage")(7680, 4320, callback, 30);
	function callback() {
		var now = Date.now();
		var date = (now - then) / 1000;
		console.log("done in " + date + "seconds");
	}
} else {
	console.log(process.argv);
	const cp = require("child_process");

	for (var i = 0; i < 30; i++) {
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
