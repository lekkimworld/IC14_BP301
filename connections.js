/* *****
IBM Connect 2014 - BP301 by Mikkel Flindt Heisterberg is licensed under a 
Creative Commons Attribution-ShareAlike 4.0 International License.

http://creativecommons.org/licenses/by-sa/4.0/deed.en_US
***** */

// require
var https = require("https");

var AS = function(hostname, credentials) {
	this.get = function(callback, options) {
		// make sure there is a callback
		if (!callback) {
			throw new Error("Must have a callback - otherwise what's the point!?");
		}
		
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
				"Authorization": "Basic " + credentials()
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
	this.post = function(entry, callback) {
		// compose path
		var path = "/connections/opensocial/basic/rest/activitystreams/@me/@all";
		
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
				"Authorization": "Basic " + credentials()
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
 		req.write(postData);
		req.end();
	},
	this._getOption = function(options, key, defaultValue) {
		return (options && options[key]) ? options[key] : defaultValue;
	}
}
var Entry = function() {
	this.I = function() {
		this.actor = {id: "@me"};
		return this;
	},
	this.userId = function() {
		
	},
	this.posted = function() {
		this.verb = "post";
		this.title = "${post}";
		return this;
	},
	this.created = function() {
		this.verb = "create";
		this.title = "${create}";
		return this;
	},
	this.shared = function() {
		this.verb = "share";
		this.title = "${share}";
		return this;
	},
	this.on = function(date) {
		this.updated = date.toISOString();
		return this;
	},
	this.object = function(obj) {
		this.object = obj;
		return this;
	}
}

// exports
exports.AS = AS;
exports.Entry = Entry;
