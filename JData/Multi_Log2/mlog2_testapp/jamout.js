var jserver = require('jamserver')(true);
var JAMLogger = jserver.JAMLogger;
var JAMManager = jserver.JAMManager;
var JAMBroadcaster = jserver.JAMBroadcaster;
const {Flow, ParallelFlow, PFlow, InFlow, OutFlow} = require('flows.js')(JAMManager);
PFlow.useCores(require('os').cpus().length);
var jamlib = jserver.jamlib;
var jnode = jserver.jnode;
var jsys = jserver.jsys;
var http = require('http');
var cbor = require('cbor');
var qs = require('querystring');
var path = require('path');
var mime = require('mime');
var fs = require('fs');
var name = new JAMLogger(JAMManager, "name");
jnode.addLogger("name", name.getMyDataStream());
var count = 1;
setInterval(function () {
for (i = 0; i < name.size(); i++) {
if (name[i] !== undefined) {
console.log("name[" + i + "] = ", name[i].lastValue(), "deviceID = ", name[i].getDeviceId());
} else {
console.log("Logger value undefined...");
}
}
}, 5000);
var namelogger = name.getMyDataStream();
setInterval(function () {
namelogger.log("Count = " + count++ + " @J, level = " + namelogger.getLevel(), function (results) {
if (!results.status) {
console.log(results.error);
}
});
}, 5000);
var mbox = {
"functions": {
},
"signatures": {
}
}
jamlib.registerFuncs(mbox);
jamlib.run(function() { console.log("JAMLib 1.0beta Initialized."); } );
