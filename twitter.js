/* *****
IBM Connect 2014 - BP301 by Mikkel Flindt Heisterberg is licensed under a 
Creative Commons Attribution-ShareAlike 4.0 International License.

http://creativecommons.org/licenses/by-sa/4.0/deed.en_US
***** */

// declarations
var TWITTER_CONSUMER_KEY = process.env.IC14_BP301_CONSUMER_KEY;
var TWITTER_CONSUMER_SECRET = process.env.IC14_BP301_CONSUMER_SECRET;
var HOSTNAME = "api.twitter.com";
var TOKEN = null;
var SINCE_ID = null;

// requires
var secret = require("./secret");
var https = require("https");

/**
 * Credentials encoding for Twitter OAuth2.
 */
var getCredentials = function() {
	var creds = "Basic " + secret.credentials(TWITTER_CONSUMER_KEY, 
		TWITTER_CONSUMER_SECRET, 
		true);
	return creds;
}

/**
 * Utility function to obtain a bearer token.
 */
var getBearerToken = function(callback) {
	var optToken = {
		"host": HOSTNAME,
		"path": "/oauth2/token",
		"method": "POST",
		"headers": {
			"Authorization": getCredentials(),
			"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
			"Content-Length": 29
		}
	};
	var req = https.request(optToken, function(res) {
		res.on("data", function(d) {
			var j = JSON.parse(d);
			TOKEN = j.access_token;
			callback();
		});
	});
	req.write("grant_type=client_credentials\n");
	req.end();
}

/**
 * Do twitter search.
 */
var search = function(query, callback) {
	if (!TOKEN) {
		// no bearer token - go get it
		process.stdout.write("No bearer token for Twitter found - requesting it\n");
		getBearerToken(function() {
			search(query, callback);
		});
	} else {
		// do search - compose arguments
		process.stdout.write("Searching for <" + query + "> since <" + SINCE_ID + ">\n");
		var urlArgs = "q=" + encodeURIComponent(query) + "&count=100";
		if (SINCE_ID) urlArgs += "&since_id=" + SINCE_ID;
		
		// compose options
		var options = {
			"host": HOSTNAME,
			"path": "/1.1/search/tweets.json?" + urlArgs,
			"method": "GET", 
			"headers": {
				"Authorization": "Bearer " + TOKEN
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
					SINCE_ID = j.search_metadata.since_id;
				} else {
					SINCE_ID = j.search_metadata.max_id + 1;
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
	this.getID = function() {
		return this.obj.id;
	}
	this.getURL = function() {
		return "https://twitter.com/" + this.getSender() + "/status/" + this.obj.id_str;
	}
	this.getSender = function() {
		return this.obj.user.screen_name;
	}
	this.getSenderImageURL = function() {
		return this.obj.user.profile_image_url;
	}
	this.getSenderProfileURL = function() {
		try {
			return this.obj.user.entities.url.urls[0].expanded_url;
		} catch (e) {
			return null;
		}
	}
	this.getMentions = function() {
		var mentions = this.obj.entities.user_mentions;
		var result = [];
		for (var k=0; k<mentions.length; k++) {
			var mention = mentions[k];
			if (!result.indexOf(mention.screen_name.toLowerCase()) != -1) result.push(mention.screen_name.toLowerCase());
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
