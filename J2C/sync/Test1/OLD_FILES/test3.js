var async = require('asyncawait/async');
var await = require('asyncawait/await');


function resolveAfter2Seconds(x) {
    return new Promise(function(resolve, reject) {
	    setTimeout(() => {
		    resolve(x);
		}, 1000);
	});
}

var add1 = async (function (x) {
	console.log(".....Add1...");
    var a = resolveAfter2Seconds(20);
	console.log(a);
    var b = resolveAfter2Seconds(30);
    console.log("Add1..");
    return x + await (a) + await (b);
    });

add1(5).then(v => {
	console.log("After add1...");
	console.log(v);  // prints 60 after 2 seconds.
	console.log("After add1...vvvv");
    });

var add2 = async(function (x) {
	console.log(".....Add2...");
	var a = await( resolveAfter2Seconds(20));
	var b = await( resolveAfter2Seconds(30));
    console.log("Add2..");
    return x + a + b;
    });

add2(34).then(v => {
	console.log(v);  // prints 60 after 4 seconds.
    });
