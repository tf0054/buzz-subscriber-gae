var Request = require("jack/request").Request,
    Response = require("jack/response").Response;
	
// "/_ah/mail/アドレス"へのhttp受信ページ
// http://d.hatena.ne.jp/gungnir_odin/20091026
    
exports.app = function(env) {
    return exports[env.REQUEST_METHOD](env);
}

exports.GET = function(env) {
    return {
        status: 200,
        headers: {"Content-Type": "text/html"},
	body: ["xxx"]
        // body: [(String)params]
    };
}

exports.POST = function(env) {
    var params = new Request(env).POST();
  
    return {
        status: 200,
        headers: {"Content-Type": "text/html"},
	body: ["xxx"]
        // body: [(String)params]
    };
  
}