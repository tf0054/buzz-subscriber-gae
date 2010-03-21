
var ContentLength = require("jack/contentlength").ContentLength,
    MethodOverride = require("jack/methodoverride").MethodOverride,
    Head = require("jack/head").Head;
        
var Dispatch = require("nitro/dispatch").Dispatch,
    Path = require("nitro/path").Path,
    Errors = require("nitro/errors").Errors,
    Render = require("nitro/render").Render;

// nitroを使わない場合の呼び出し方
// exports.app = require('./index').app;

// 直接書いてもよい
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
		{templateRoot: "WEB-INF/src/templates"})
	))
)));

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

// nitroを使わない場合
// exports.local = function(app) {
    // return ContentLength(exports.app);
// }

exports.local = function(app) {
    return exports.app;
}