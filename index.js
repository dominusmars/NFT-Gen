const createImage = require('./createImage');
var argv = require("minimist")(process.argv.slice(2));
const fs = require("fs");

if (process.argv[2] == "child") {
    var i = process.argv[3];
    createImage(7680, 4320, callback, 15);
    function callback(buffers) {
        for (var p = 0; p < buffers.length; p++) {
            fs.writeFileSync(`./test/test${i}_${p}.png`, buffer);
        }
    }
} else {
    console.log(process.argv)
    const cp = require("child_process");

    for (var i = 0; i < 1; i++) {
        startChild(i)
    }
    function startChild(i) {
        console.log("hello!");
        var child = cp.fork(__filename, ["child", i], {
            stdio: ["inherit", "inherit", "inherit", "ipc"],
        })
        child.on("error", (e) => {
            console.log(e)
        })

    }
}

