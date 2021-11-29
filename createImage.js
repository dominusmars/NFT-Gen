const { createCanvas, loadImage } = require("canvas");
const Vector = require("./vector");
// var argv = require("minimist")(process.argv.slice(2));
var alpha = randomNumber(1, 10);
var beta = randomNumber(1, 10);
var theta = randomNumber(10, 60)
var deta = randomNumber(10, 60);
var charle = randomNumber(10, 60)
const seed = Math.random() + Math.random();
const colorSeed = randomAngle();
const size = 1;
const scale = 2000 * Math.random() + 500;
const offset = 1 * Math.random() + 1;
var pictures = [];
async function createImage(width, height, callback, i) {
	console.log(`Drawing image ___ ${i}`)
	if (i == 0) {
		callback(pictures)
	}
	alpha = alpha - (1 / alpha);
	beta = beta - (1 / beta);
	theta = theta - (1 / theta);
	deta = deta - (1 / deta);
	charle = charle - (1 / charle);

	const canvas = createCanvas(width, height);
	const context = canvas.getContext("2d");
	context.fillStyle = getRandomColorHex();
	context.fillRect(0, 0, width, height);
	var vector = new Vector(100 * Math.random() + 1, 100 * Math.random() + 1);
	var past = 0;
	function createFractial() {
		for (var y = 0; y < height; y = y + size) {
			for (var x = 0; x < width; x = x + size) {
				var offsetedX = (x + offset) / scale;
				var offsetedY = (y + offset) / scale;
				var tempx = mappingFunction(offsetedX);
				var tempy = mappingFunction(offsetedY);
				var value = random(tempx, tempy);
				vector = vector.addVector(new Vector(value, Math.sin(Math.random())));
				context.fillStyle = getVectorHex(vector);
				vector = vector.getStanderedVector()
				context.fillRect(x, y, size, size);
			}
			var percent = Math.round(y / height * 100);
			if (percent > past) {
				past = percent;
				console.log(`{${percent} %} ${(vector.getAngle() * 180) / Math.PI}  ${vector.getMag()}`);
			}
		}
	}

	createFractial();
	const buffer = canvas.toBuffer("image/png");
	pictures.push(buffer);
	i = i - 1;
	createImage(7680, 4320, callback, i)

	function getVectorHex(vector) {
		return "#" + Math.floor((getValueFromAngle(vector.getAngle() + colorSeed) * 16777215)).toString(16);
	}

}
function mappingFunction(x) {
	// return (x / 60) * Math.pow(x, 3) * (30 / (x - 21))
	var x = 1 / x;
	return Math.abs((alpha * Math.sin(beta / x) * theta * (x * x * x) + deta * x) / (beta * (x * x) + x));
}
function random(x, y) {
	x = x * seed;
	y = y * seed;
	return (alpha * (x * x + y * y)) / (charle * Math.sin(1 / x * y * beta));
}
function getRandomColorHex() {
	return "#" + Math.floor(Math.random() * 16777215).toString(16);
}
function getValueFromAngle(angle) {
	return Math.sin(angle);
}
function randomAngle() {
	return Math.random() * (Math.PI / 2);
}
function randomNumber(x, y) {
	return (Math.random() * (y - x)) + x;
}
module.exports = createImage