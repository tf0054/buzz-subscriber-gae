var db = require("google/appengine/ext/db");

/**
 * A Guestbook message.
 */
var Message = exports.Message = db.Model.extend("Message", {
	created: new db.DateProperty({autoNowAdd: true}),
	topic: new db.StringProperty(),
	challenge: new db.TextProperty()
});
