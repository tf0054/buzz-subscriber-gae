// require.paths.unshift("WEB-INF/src");

// var ContentLength = require("jack/contentlength").ContentLength;

var ContentLength = require("jack/contentlength").ContentLength,
    MethodOverride = require("jack/methodoverride").MethodOverride,
    Head = require("jack/head").Head;
        
var Dispatch = require("nitro/dispatch").Dispatch,
    Path = require("nitro/path").Path,
    Errors = require("nitro/errors").Errors,
    Render = require("nitro/render").Render;
	
// exports.app = require('./index').app;

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

// exports.appは必ず定義しなくてはならない!(exports.localがあってもだめ)
exports.app = ContentLength(Head(MethodOverride(
        Path(Errors(
		Render(Dispatch({dispatchRoot: "WEB-INF/src/root"}),
		{templateRoot: "WEB-INF/src/templates2"})
	))
)));
//         Path(Errors(Render(Wrap(Dispatch({dispatchRoot: "WEB-INF/src/root"})), {templateRoot: "WEB-INF/src/templates"}))))));

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

// exports.local = function(app) {
    // return ContentLength(exports.app);
// }

exports.local2 = function(app) {
    return ContentLength(exports.app2);
}

exports.local = function(app) {
    return exports.app;
}