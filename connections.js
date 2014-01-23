/* *****
IBM Connect 2014 - BP301 by Mikkel Flindt Heisterberg is licensed under a 
Creative Commons Attribution-ShareAlike 4.0 International License.

http://creativecommons.org/licenses/by-sa/4.0/deed.en_US
***** */

// declarations
var IC14_USERNAME = process.env.IC14_USERNAME;
var IC14_PASSWORD = process.env.IC14_PASSWORD;

// require
var secret = require("./secret");
var https = require("https");

var AS = function(hostname) {
	this._getCredentials = function() {
		var creds = "Basic " + secret.credentials(IC14_USERNAME, 
			IC14_PASSWORD);
		return creds;
	}
	this.get = function(callback, options) {
		// make sure there is a callback
		if (!callback) {
			throw new Error("Must have a callback - otherwise what's the point!?");
		}
		var that = this;
		
		// get data
		var userid = this._getOption(options, "userid", "@me");
		var groupid = this._getOption(options, "groupid", "@all");
		var appid = this._getOption(options, "appid", "@all");
		
		// compose path
		var path = "/connections/opensocial/basic/rest/activitystreams/" + 
			userid + "/" + 
			groupid + "/" + 
			appid;
		
		// create options for request and do it
		var reqOptions = {
			"host": hostname,
			"path": path,
			"method": "GET",
			"headers": {
				"Authorization": that._getCredentials()
			}
		}
		var req = https.request(reqOptions, function(res) {
			var result = "";
			res.on("data", function(data) {
				result += data;
			});
			res.on("end", function() {
				var j = JSON.parse(result);
				callback(j);
			});
		});
		req.end();
	},
	this.post = function(entry, options, callback) {
		// keep ref
		var that = this;
		
		// get stream
		var streamid = this._getOption(options, "streamid", "@me");
		
		// compose path
		var path = "/connections/opensocial/basic/rest/activitystreams/" + streamid + "/@all";
		
		// stringify POST data
		var postData = JSON.stringify(entry);
		
		// create options for request and do it
		var reqOptions = {
			"host": hostname,
			"path": path,
			"method": "POST",
			"headers": {
				"Content-Type": "application/json", 
				"Content-Length": postData.length,
				"Authorization": that._getCredentials()
			}
		}
		var req = https.request(reqOptions, function(res) {
			var result = "";
			res.on("data", function(data) {
				result += data;
			});
			res.on("end", function() {
				try {
					var j = JSON.parse(result);
					callback(j);
				} catch (e) {
					process.stdout.write("ERROR <" + e + ">\n");
				}
			});
		});
 		req.write(postData);
		req.end();
	},
	this._getOption = function(options, key, defaultValue) {
		return (options && options[key]) ? options[key] : defaultValue;
	}
}
var Entry = function() {
	this.result = {};
	this.I = function() {
		this.result.actor = {id: "@me"};
		return this;
	},
	this.userId = function() {
		
	},
	this.posted = function() {
		this.result.verb = "post";
		this.result.title = "${post}";
		return this;
	},
	this.created = function() {
		this.result.verb = "create";
		this.result.title = "${create}";
		return this;
	},
	this.shared = function() {
		this.result.verb = "share";
		this.result.title = "${share}";
		return this;
	},
	this.content = function(str) {
		this.result.content = str;
		return this;
	},
	this.on = function(date) {
		this.result.updated = date.toISOString();
		return this;
	},
	this.object = function(obj) {
		this.result.object = obj;
		return this;
	},
	this.generator = function(obj) {
		this.result.generator = obj;
		return this;
	},
	this.finalize = function() {
		return this.result;
	}
}

// exports
exports.AS = AS;
exports.Entry = Entry;
