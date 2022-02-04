var argv = require("minimist")(process.argv.slice(2));
const fs = require("fs");
const gifLength = 50;
const childProcesses = 10;
const NeededGIFS = 100;
var currentDoneGIFS = 0;


if (process.argv[2] == "child") {
	var i = process.argv[3];
	var then = Date.now();
	require("./modules/createImage")(callback, gifLength);
	function callback(bools) {
			if(!bools){
				process.send("failed");
			}else{
				var now = Date.now();
				var date = (now - then) / 1000;
				console.log("done in " + date + "seconds");
				process.send("done")
			}
			
	}
} else {
	console.log("Starting Processes");
	const cp = require("child_process");

	for (var i = 0; i < childProcesses; i++) {
		startChild(i);
	}
	function startChild(i) {
		console.log("Starting  Gif!");
		var child = cp.fork(__filename, ["child", i], {
			stdio: ["inherit", "inherit", "inherit", "ipc"],
		});
		child.on("error", (e) => {
			console.log(e);
		});
		child.on("message", (m)=>{
			console.log(m)
			if(m == "done"){
				currentDoneGIFS++;
				console.log("count: ", currentDoneGIFS);
				console.log("needed: ", NeededGIFS);

				if(currentDoneGIFS < NeededGIFS){
					startChild(i)
				}
			}else{
				startChild(i)
			}
		})
	}
}
