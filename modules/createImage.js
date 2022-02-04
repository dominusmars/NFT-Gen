const { createCanvas, loadImage } = require("canvas");
const Vector = require("./vector");
const fs = require("fs");
const helper = require("./helperFuctions")
var testing = false;
var testNumbers ={
	"scale":2000,
	"offset":300,
	"Gravitational": 1, // 1-4
	"Force": 1, //changes start
	"Distance": 1, // changes speed 
	"Mass":  (process.argv[3] * 10 )+1, //changes the distorts of the graph
	"xFunction": 1,
	"yFunction": 1,
	"seed": 0.1,
	"blend": 100,
	"colorSeed": 0,
	"algoX":[2,1,3, 3 ,5 ,6],
	"algoY":[0,1,4]
}
var gravity =testing ? testNumbers["Gravitational"]:  helper.randomNumber(1, 3);
var force = testing ? testNumbers["Force"]: helper.randomNumber(10, 50);
var distance = testing? testNumbers["Distance"]: helper.randomNumber(1, 5);
var mass =testing ? testNumbers["Mass"]: helper.randomNumber(10, 500);
var work = testing ? testNumbers["Work"]: helper.randomNumber(1,60);
var yFunction =testing? testNumbers["yFunction"]: helper.randomNumber(1, 4, true);
var xFunction =testing? testNumbers["xFunction"]: helper.randomNumber(1, 4, true);

const seed =testing? testNumbers["seed"]: Math.random();
const colorSeed =testing ? testNumbers["colorSeed"]: helper.randomAngle();
const blend =testing ? testNumbers["blend"]: helper.randomNumber(1, 1000);
const size = 4;
const scale = testing ? testNumbers["scale"]: 2000 * Math.random() + 500;
const offset = testing ? testNumbers["offset"] :500 * Math.random() + 10;
const Name = process.argv[3]+  helper.randomString();
const MathFunctions = require("./Maths");
var forward = helper.randomNumber(0,2,true);
var algoX = testing? testNumbers["algoX"]: createMathAlgo();
var algoY =testing? testNumbers["algoY"]: createMathAlgo();

const width = 540;
const height = 648;


var active = true;
fs.mkdirSync("./test/" + Name);
const GIFEncoder = require("gifencoder");


var Mapping = {
	1: "Sine",
	2: "Cosine",
	3: "Tangent"
}
var forwardMap = {
	0: true,
	1: false
}
var generationMap = {
	2: 0,
	3: 1,
	4: 2,
}
var constants = {
	name: "Accretion",
	description:"Accretions are computer generated based on a few attributes. Gravities are used to meld stars to create star-strucking images. Accretions are the mappings of these images.",
	external_url:"accretionnft.com",
	attributes:[
		{
			"trait_type": "XFACTOR",
			"value": Mapping[xFunction],
		},
		{
			"trait_type": "YFACTOR",
			"value": Mapping[yFunction],
		},
		{
			"trait_type": "Forward",
			"value": forwardMap[forward],
		},
		{
			"trait_type": "Density",
			"value": Math.floor(size),
		},
		{
			"trait_type": "Blend",
			"value": Math.floor(blend / 100)
		},
		{
			"trait_type": "Gravitational Constant",
			"value": Math.floor(gravity)
		},
		{
			"trait_type": "Work",
			"value": Math.floor(work)
		},
		{
			"trait_type": "Force",
			"value": Math.floor(force)
		},
		{
			"trait_type": "Distance",
			"value": Math.floor(distance)
		},
		{
			"trait_type": "Mass",
			"value": Math.floor(mass)
		},
		{
			"display_type": "number", 
			"trait_type": "Generation", 
			"value": generationMap[size]
		  }

	],
};
var JsonString = JSON.stringify(constants);

fs.writeFileSync("./finished/" + Name + ".json", JsonString.split(",\"").join(", \n\""));


const encoder = new GIFEncoder(width, height);
const Maths = require("./Maths");


encoder.createReadStream().pipe(fs.createWriteStream("./finished/" + Name + ".gif"));
encoder.start();
encoder.setRepeat(0); // 0 for repeat, -1 for no-repeat
encoder.setDelay(50); // frame delay in ms
encoder.setQuality(10);

var val = 0;
var imageSeed;


async function createImage(callback, i,progress) {
	if(!active){
		return;
	}
	if (i <= 0) {
		return;
	}
	
	
	val = val + 1;
	if(forward){
		distance -= gravity * (1 / distance);
		mass -= gravity * (1 / mass);
		force -= gravity * (1 / force);
		work -= gravity * (1/work);

	}else{
		distance += gravity * (1 / distance);
		mass += gravity * (1 / mass);
		force += gravity * (1 / force);
		work += gravity * (1/work);
	}
	
	imageSeed = (distance/(mass)) + (1/ force);

	const canvas = createCanvas(width, height);
	const context = canvas.getContext("2d");
	context.fillStyle = helper.getRandomColorHex();
	context.fillRect(0, 0, width, height);
	var vector = new Vector(1 * Math.random(), 1 * Math.random());


	var pastPercent = 0;
	function createFractial() {
		for (var y = 0; y < height; y = y + size) {
			for (var x = 0; x < width; x = x + size) {
				var offsetedX = (x + offset) / scale;
				var offsetedY = (y + offset) / scale;
				var tempx = mappingFunction(offsetedX);
				var tempy = mappingFunction(offsetedY);
				var algoCopyX = Object.assign([], algoX);
				var algoCopyY = Object.assign([], algoY);
				var value = tarverseMathAlgo(tempx,tempy, algoCopyX);
				var valueY = tarverseMathAlgoY(tempx,tempy, algoCopyY);
				// var value = random(tempx, tempy);
				// var valueY = randomForY(tempx,tempy)

				vector = vector.addVector(new Vector(value, valueY));
				context.fillStyle = getVectorHex(vector);
				vector = vector.getStanderedVector();
				context.fillRect(x, y, size, size);
			}
		}
		var percent = Math.round((val / (i + val)) * 50);


		//If failure the function will finish and delete the gif
		if(isNaN(vector.getAngle())){
			encoder.finish();
			console.log("FAILED DELETING GIF");
			
			fs.unlinkSync("./finished/" + Name + ".gif")
			fs.unlinkSync("./finished/" + Name + ".json");

			console.log("DELETED  " + Name);
			active = false;
			return callback(false); 

		}



		if (percent > pastPercent) {
			pastPercent = percent;
			
			console.log(`{${percent}% ${i} ${colorSeed}} ${(vector.getAngle() * 180) / Math.PI} ${Name}`);
		}
	}

	createFractial();
	encoder.addFrame(context);

	i = i - 1;
	
	createImage(callback, i, true);

	if(!active){
		return;
	}

	i = i + 1;

	var percent  = Math.floor(50 + Math.round((i / (i + val)) * 100));

	console.log(`{${percent} %} ${Name}`);

	
	encoder.addFrame(context);

	if (!progress) {
		encoder.finish();
		return callback(true);
	}
	function getVectorHex(vector) {
		return "#" + Math.floor(getAngle(vector.getAngle()) * 16777215).toString(16);
	}
	//(getValueFromAngle(1/(vector.getAngle()) + colorSeed))
	
	function getAngle(angle){
		var colorValue =  helper.getValueFromAngle((angle + colorSeed / blend )) ;
		return colorValue;
	}
}



function mappingFunction(x) {
	var x = 1 / x;
	return work * Math.cos(x + (1/ work)) / mass;
}

function createMathAlgo(){
	var length = MathFunctions.length;

	var mathlength = helper.randomNumber(1, 1,true);

	var result = [];
	for(var i = 0; i< mathlength;i++){
		result[i] = helper.randomNumber(0,length,true);
	}
	return result;
}


function tarverseMathAlgo(x,y,mathArray){
	switch (xFunction) {
		case 1:
			return distance * Math.sin(commitMathArray(x,y,mathArray));

		case 2:
			return distance * Math.cos(commitMathArray(x,y,mathArray));
		case 3:
			return distance * Math.tan(commitMathArray(x,y,mathArray));
	
		default:
			return distance * Math.sin(commitMathArray(x,y,mathArray));

	}
}
function tarverseMathAlgoY(x,y,mathArray){
	switch (yFunction) {
		case 1:
			return distance * Math.sin(commitMathArray(x,y,mathArray));

		case 2:
			return distance * Math.cos(commitMathArray(x,y,mathArray));
		case 3:
			return distance * Math.tan(commitMathArray(x,y,mathArray));
		default:
			return distance * Math.sin(commitMathArray(x,y,mathArray));

	}

}
function commitMathArray(x,y,mathArray){
	var i = mathArray.pop();

	if(mathArray.length == 0 ){
		return Maths[i](x,y);
	}
	

	return Maths[i](commitMathArray(x,y,mathArray),imageSeed) ;
}


module.exports = createImage;
