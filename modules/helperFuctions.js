module.exports = {
     getRandomColorHex: function() {
        return "#" + Math.floor(Math.random() * 16777215).toString(16);
    },
    getValueFromAngle: function(angle) {
        return Math.abs((Math.sin(angle) + 1)/2);
    },
    randomAngle: function() {
        return Math.random() * (Math.PI);
    },
     randomNumber: function(min, max, bool) {
        if(bool) return Math.floor(Math.random() * (max - min) + min);
        return Math.random() * (max - min) + min;
    },
    randomString: function() {
        var strings = `abcdefghijklmnopqrstuvwxyz`;
        var result = "";
        for (var i = 0; i < 10; i++) {
            result += strings[Math.floor(this.randomNumber(0, strings.length - 1))];
        }
        console.log(result);
        return result;
    },
    
    
}


