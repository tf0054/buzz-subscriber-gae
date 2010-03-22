var Request = require("nitro/request").Request;
var Response = require("nitro/request").Response;

var fetch = require("google/appengine/api/urlfetch").fetch;

var Message = require("../message").Message;

// nitro経由で呼び出すのでapp化不要
/*
exports.app = function(env) {
    return exports[env.REQUEST_METHOD](env);
}
*/

exports.GET = function(env) {
	var params = new Request(env).params();
	var messages = Message.all().order("-created").fetch();
       var body = '<h1>update</h1>';
		
	if(params.key == undefined){
		params.key = 'sync,async';
	}
    
	if (messages.length > 0) {
		messages.forEach(function(m) {
			body += '<div class="message">'+ m.created + '</p>' + m.topic + '</p>' + m.challenge + '</div>';
		});
	} else {
		var base = "http://" + env["SERVER_NAME"] + (env["SERVER_PORT"] == "80" ? "" : ":" + env["SERVER_PORT"]);

		body += '<div class="message">No messages, sent subscribe request!</div>';
		// 登録要求
		var strPing = 'hub.mode=subscribe&' + 'hub.callback='+base+'/update&' + 'hub.topic=http://tf0054-06.appspot.com/atom&' + 'hub.verify='+params.key;
		system.log.info("request: "+strPing);
		var response = fetch("http://pubsubhubbub.appspot.com/subscribe",strPing,"POST",{"Content-Type":"application/x-www-form-urlencoded"});
		system.log.info("response: "+response.statusCode+' / '+response.content.decodeToString("UTF-8"));
		body += '<hr/>status: '+response.statusCode+'\n' + new Date();
	}

	body += '<hr/>\n' + new Date();

	return {data: {
		body: body
	}};
}