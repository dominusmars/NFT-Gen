const { createCanvas, loadImage } = require("canvas");
const Vector = require("./vector");
const fs = require("fs");
var alpha = randomNumber(1, 10);
var beta = randomNumber(1, 10);
var theta = randomNumber(10, 60);
var deta = randomNumber(10, 60);
var charle = randomNumber(10, 60);
var echo = randomNumber(10, 60);
var techo = randomNumber(10, 60);
const seed = Math.random() + Math.random();
const colorSeed = randomAngle();
const size = 1;
const scale = 2000 * Math.random() + 500;
const offset = 200 * Math.random() + 1;
const Name = randomString();
fs.mkdirSync("./test/" + Name);
const GIFEncoder = require("gifencoder");

var constants = {
	alpha: alpha,
	beta: beta,
	theta: theta,
	deta: deta,
	charle: charle,
	echo: echo,
	techo: techo,
	seed: seed,
	colorSeed: colorSeed,
	size: size,
	scale: scale,
	offset: offset,
	name: Name,
};
fs.writeFileSync("./test/" + Name + "/constants.json", JSON.stringify(constants));
const encoder = new GIFEncoder(1080, 1297);
const pngFileStream = require("png-file-stream");
encoder.createReadStream().pipe(fs.createWriteStream("./finished/" + Name + ".gif"));

encoder.start();
encoder.setRepeat(0); // 0 for repeat, -1 for no-repeat
encoder.setDelay(30); // frame delay in ms
encoder.setQuality(10);
var stepTwo = false;
var val = 0;
async function createImage(width, height, callback, i) {
	// console.log(`Drawing image ${Name} ${i}`);
	if (i <= 0) {
		stepTwo = true;
	}
	if (stepTwo && i >= val) {
		encoder.finish();
		return callback(Name);
	}
	if (!stepTwo) {
		val = val + 1;
		echo -= alpha * (1 / echo);
		techo -= alpha * (1 / techo);
		charle -= alpha * (1 / charle);
	} else {
		echo += alpha * (1 / echo);
		techo += alpha * (1 / techo);
		charle += alpha * (1 / charle);
	}

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
				vector = vector.getStanderedVector();
				context.fillRect(x, y, size, size);
			}
		}
		var percent = !stepTwo ? Math.round((val / (i + val)) * 50) : 51 + Math.round((i / (i + val)) * 100);
		if (percent > past) {
			past = percent;
			console.log(`{${percent} %} ${(vector.getAngle() * 180) / Math.PI} ${Name}`);
		}
	}

	createFractial();
	encoder.addFrame(context);
	const buffer = canvas.toBuffer("image/png");
	// pictures.push(buffer);
	fs.writeFileSync("./test/" + Name + `/${Name}_${i}.png`, buffer);
	if (stepTwo) {
		i = i + 1;
	} else {
		i = i - 1;
	}
	createImage(width, height, callback, i);

	function getVectorHex(vector) {
		return "#" + Math.floor(getValueFromAngle(vector.getAngle() + colorSeed) * 16777215).toString(16);
	}
}
function mappingFunction(x) {
	var x = 1 / x;
	return Math.abs((alpha * Math.sin(beta / x) * theta * (x * x * x) + deta * x) / (beta * (x * x) + x));
}
function random(x, y) {
	x = x * seed;
	y = y * seed;
	return (echo * (x * x + y * y)) / (charle * Math.sin((1 / x) * y * techo));
}
function getRandomColorHex() {
	return "#" + Math.floor(Math.random() * 16777215).toString(16);
}
function getValueFromAngle(angle) {
	return Math.sin(angle);
}
function randomAngle() {
	return Math.random() * (Math.PI / 3);
}
function randomNumber(x, y) {
	return Math.random() * (y - x) + x;
}
function randomString() {
	var strings = `abcdefghijklmnopqrstuvwxyz`;
	var result = "";
	for (var i = 0; i < 10; i++) {
		result += strings[Math.floor(randomNumber(0, strings.length - 1))];
	}
	console.log(result);
	return result;
}
module.exports = createImage;
