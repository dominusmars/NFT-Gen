class ThreeDVector {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    addVector(vector) {
        return new ThreeDVector(this.x + vector.x, this.y + vector.y, this.z + vector.z);
    }
    getMag() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    getAlpha() {
        return Math.acos(this.x / this.getMag())
    }
    getBeta() {
        return Math.acos(this.y / this.getMag())
    }
    getThata() {
        return Math.acos(this.z / this.getMag())
    }
    toString() {
        return "[" + this.x + ", " + this.y + ", " + this.z + ",]";
    }
}
module.exports = ThreeDVector;