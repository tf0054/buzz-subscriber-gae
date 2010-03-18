var Request = require("jack/request").Request,
    Response = require("jack/response").Response;

var EmailMessage = require("google/appengine/api/mail").EmailMessage;

exports.app = function(env) {
    return exports[env.REQUEST_METHOD](env);
}

exports.GET = function(env) {

	var fs = require("file"),
		Template = require("template").Template;

	var data = {
		name: "George",
		profile: {
			age: 34,
			gender: "M"
		},
/*
		articles: [
			{ "Hello world", 34 },
			{ "Another article", 23 },
			{ "The final", 7 }
		],
*/
		admin: true
	}

	// \\でディレクトリを核とローカルでしか動かない
	var src = fs.read("WEB-INF/src/templates/test.html").toString();
	var template = new Template(src);
	
	var EmailMessage = require("google/appengine/api/mail").EmailMessage;
	new EmailMessage({
		// http://code.google.com/intl/ja/appengine/docs/python/mail/emailmessagefields.html
		sender: "tf0054@gmail.com",
		to: "buzz@gmail.com",
		cc: "tf0054@yahoo.co.jp",
		subject: "TEST",
		body: "メールからの投稿テスト / POST test with mail"
	}).send();
	return {
		status: 200,
		headers: {"Content-Type": "text/html"},
		body: [template.render(data)]
	}
}

exports.POST = function(env) {
	var objReq = new Request(env);
	var params = objReq.POST();
	var strMail = '';
	var EmailMessage = require("google/appengine/api/mail").EmailMessage;
	new EmailMessage({
		// http://code.google.com/intl/ja/appengine/docs/python/mail/emailmessagefields.html
		sender: "tf0054@gmail.com",
		to: "buzz@gmail.com",
		subject: "TEST",
		body: "メールからの投稿テスト / POST test with mail"
	}).send();
}