var wait = require('wait.for-es6');


function resolveAfter2Seconds(err, cback) {

    setTimeout(() => {
	    cback(null, 100);
    }, 1000);
};


function* main() {

    console.log("Before calling..");
    var cback = yield wait.for(resolveAfter2Seconds, null);
    console.log("After calling...", cback);
}

wait.launchFiber(main);