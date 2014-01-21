// declarations
var HOSTNAME = "api.twitter.com";
var token = null;
var sinceId = null;

// requires
var https = require("https");

/**
 * Utility function to obtain a bearer token.
 */
var getBearerToken = function(credentials, callback) {
	var optToken = {
		"host": HOSTNAME,
		"path": "/oauth2/token",
		"method": "POST",
		"headers": {
			"Authorization": "Basic " + credentials(),
			"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
			"Content-Length": 29
		}
	};
	var req = https.request(optToken, function(res) {
		res.on("data", function(d) {
			var j = JSON.parse(d);
			token = j.access_token;
			callback();
		});
	});
	req.write("grant_type=client_credentials\n");
	req.end();
}

/**
 * Do twitter search.
 */
var search = function(query, credentials, callback) {
	if (!token) {
		// no bearer token - go get it
		process.stdout.write("No bearer token for Twitter found - requesting it\n");
		getBearerToken(credentials, function() {
			search(query, credentials, callback);
		});
	} else {
		// do search - compose arguments
		process.stdout.write("Searching for <" + query + "> since <" + sinceId + ">\n");
		var urlArgs = "q=" + encodeURIComponent(query);
		if (sinceId) urlArgs += "&since_id=" + sinceId;
		
		// compose options
		var options = {
			"host": HOSTNAME,
			"path": "/1.1/search/tweets.json?" + urlArgs,
			"method": "GET", 
			"headers": {
				"Authorization": "Bearer " + token
			}
		};
		
		// request
		var req = https.request(options, function(res) {
			var result = "";
			res.on("data", function(d) {
				// add to result
				result += d;
			});
			res.on("end", function() {
				// parse
				var j = JSON.parse(result);
				
				// store since
				if (j.search_metadata.since_id) {
					sinceId = j.search_metadata.since_id;
				} else {
					sinceId = j.search_metadata.max_id + 1;
				}
				
				// callback
				callback(j);
			});
		});
		req.end();
	}
};

var Status = function(obj) {
	this.obj = obj;
	this.getText = function() {
		return this.obj.text;
	}
	this.getMentions = function() {
		var mentions = this.obj.entities.user_mentions;
		var result = [];
		for (var k=0; k<mentions.length; k++) {
			var mention = mentions[k];
			if (!result.indexOf(mention.screen_name) != -1) result.push(mention.screen_name);
		}
		return result;
	}
	this.hasMention = function(username) {
		if (arguments && arguments.length == 1) {
			return this.getMentions().indexOf(username) != -1;
		} else {
			return this.getMentions().length != 0;
		}
	}
}

// export
exports.Status = Status;
exports.search = search;
