const { createCanvas, loadImage } = require("canvas");
const Vector = require("./vector");
var argv = require("minimist")(process.argv.slice(2));

const width = argv["width"];
const height = argv["height"];
const primary = getRandomColorHex();
const secondary = getRandomColorHex();
const thireary = getRandomColorHex();
const seed = Math.random() + Math.random();
const size = 1;
const scale = 2000 * Math.random() + 1;
const offset = 2000 * Math.random() + 1;
const canvas = createCanvas(width, height);
const context = canvas.getContext("2d");
const fs = require("fs");

context.fillStyle = getRandomColorHex();
context.fillRect(0, 0, width, height);
var vector = new Vector(10 * Math.random() + 1, 10 * Math.random() + 1);
function createFractial() {
	for (var y = 0; y < height; y = y + size) {
		for (var x = 0; x < width; x = x + size) {
			var value = random((x + offset) / scale, (y + vector.getAngle() + offset) / scale);
			vector = vector.addVector(new Vector(value, Math.sin(Math.random())));
			context.fillStyle = getVectorHex(vector);
			context.fillRect(x, y, size, size);
		}
	}
}

createFractial();
const buffer = canvas.toBuffer("image/png");
fs.writeFileSync("./test.png", buffer);

function random(x, y) {
	x = x * seed;
	y = y * seed;
	return Math.sin((Math.atan2(x, y) * y) / Math.log(x * y) / x);
}
function getRandomColorHex() {
	return "#" + Math.floor(Math.random() * 16777215).toString(16);
}
function getVectorHex(vector) {
	return "#" + Math.floor(getValueFromAngle(vector.getAngle()) * 16777215).toString(16);
}
function getValueFromAngle(angle) {
	return Math.sin(angle);
}
