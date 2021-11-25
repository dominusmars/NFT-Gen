class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	addVector(vector) {
		return new Vector(this.x + vector.x, this.y + vector.y);
	}
	getMag() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	getAngle() {
		return Math.atan2(this.y, this.x);
	}
	getStanderedVector() {
		var angle = this.getAngle();
		var x = Math.cos(angle);
		var y = Math.sin(angle);
		return new Vector(x, y);
	}
	toString() {
		return "[" + this.x + ", " + this.y + ",]";
	}
}
module.exports = Vector;
