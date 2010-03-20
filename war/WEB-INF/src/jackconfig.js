// require.paths.unshift("WEB-INF/src");

var ContentLength = require("jack/contentlength").ContentLength;

exports.app = require('./index').app;

exports.app2 = require('./update').app;
// exports.app2 = require('./src/test').app;

// exports.app3 = require('./src/mail-receive').app;
// exports.app3 = function(env) {
    // return {
        // status : 200,
        // headers : {"Content-Type":"text/plain"},
        // body : ["jackconfig.js is the default file jackup looks 3"]
    // };
// }

exports.local = function(app) {
    return ContentLength(exports.app);
}

exports.local2 = function(app) {
    return ContentLength(exports.app2);
}

// exports.local3 = function(app) {
    // return ContentLength(exports.app3);
// }