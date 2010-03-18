
// "2010-03-14T15:37:13.671Z"をはけるようなtoISOStringメソッドをDate型に追加してくれる
// require("global-es5");

var Request = require("jack/request").Request,
    Response = require("jack/response").Response;

var Message = require("./message").Message;

// var escapeHTML = require("html").escapeHTML;

exports.app = function(env) {
    return exports[env.REQUEST_METHOD](env);
}

exports.GET = function(env) {
	// var base = "http://" + env["SERVER_NAME"] + (env["SERVER_PORT"] == "80" ? "" : ":" + env["SERVER_PORT"]);

	var params = new Request(env).params();

	for(var i in params){
		var j = i.replace(".","_");
		params[j] = params[i];
		system.log.info(i + ': ' + params[i]);
	}

	if(hub_mode == 'subscribe'){
		var msg = new Message({
			topic:params.hub_topic,  // GAEとしてのリファレンス用
			challenge:params.hub_challenge // ページデータとして使う用
		});
		msg.put();	
		
		system.log.info(params.hub_topic + ': ' + params.hub_challenge);
		
		return {status: 200, headers: {"Content-Type": "text/html"}, body: [params.hub_challenge]};
	} else {
		system.log.info("unusual response!");

		for(var i in params){
			system.log.info(i + ': ' + params[i]);
		}
		
		return {status: 200, headers: {"Content-Type": "text/html"}, body: ["unusual response!"]};
	}
}

exports.POST = function(env) {
	//var params = new Request(env).params();
	var params = new Request(env).POST(); // 新版のjackではPOST()でとりだすべきなのか?(buzz-gae/app.js)
	
	for(var i in params){
		system.log.info('params['+i+']: ' + params[i]);
	}
	
	// POSTだからパラメータだろうとたかをくくっていたら。。ちがうみたい。
	// http://pubsubhubbub.googlecode.com/svn/trunk/pubsubhubbub-core-0.3.html#rfc.section.7.3
	// for(var i in ){
		// system.log.info('env['+i+']: ' + env[i]);
	// }
	
	// なんとコンテンツ変更通知はPOSTのbodyに入ってくる!
	var strTmp = new Request(env).body(); //でもBinaryStringでした。。
	system.log.info('body: ' + strTmp.decodeToString("utf-8"));
	
	return {status: 200, headers: {"Content-Type": "text/html"}, body: ["Thanks!"]};
}