jdata {
    char *name as logger;
}

var nlogger = name.getMyDataStream();

var count = 1;

setInterval(function() {

	console.log("Size of logger ", name.size());

	if (jsys.type === "cloud")
	    nlogger.log("fred@cloud-" + count);
	else if (jsys.type === "fog")
	    nlogger.log("fred@fog-" + count);
	else 
	    nlogger.log("fred@device-" + count);

	for (i = 0; i < name.size(); i++) {
	    if (name[i] !== undefined) {
		console.log(name[i].lastValue());
		console.log(name[i].getDeviceId());
	    }
	    else
		console.log("Logger value undefined...");
	}

	count = count + 1;
    }, 5000);
