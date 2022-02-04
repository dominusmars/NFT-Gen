var Maths = [
	adds,
	subs,
	multiply,
	divide,
	inverseX,
	inverseY,
	mathFunctionOne,
	mathFunctionTwo,
	mathFunctionThree
]

function inverseX(x,y){
	return 1/x *y;
}
function inverseY(x,y){
	return 1/x+y;
}
function mathFunctionOne(x,y){
	return x - (x * y);
}
function mathFunctionTwo(x,y){
	return x + (x * y)
}
function mathFunctionThree(x,y){
	return y + (x*y);
}
function divide(x,y){
	if(x/y != NaN) return x/y;
	if(y/x != NaN) return y/x;
	return x;
}
function adds(x,y){
	return x + y;
}
function subs(x,y){
	return Math.abs(x-y) ;
}
function multiply(x,y){
	return x * y;
}


module.exports = Maths;