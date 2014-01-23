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
		// get data
		var userid = this._getOption(options, "userid", "@me");
		var groupid = this._getOption(options, "groupid", "@all");
		var appid = this._getOption(options, "appid", "@all");
		
		// compose path
		var path = "/connections/opensocial/basic/rest/activitystreams/" + 
			userid + "/" + 
			groupid + "/" + 
			appid;
		
		// GET it
		this._doRequest("GET", path, null, callback);
	},
	this.post = function(entry, options, callback) {
		// get stream
		var streamid = this._getOption(options, "streamid", "@me");
		
		// compose path
		var path = "/connections/opensocial/basic/rest/activitystreams/" + 
			streamid + "/@all";
		
		// POST it
		this._doRequest("POST", path, entry, callback);
	},
	this.save = function(id, flag, callback) {
		// compose path
		var path = "/connections/opensocial/basic/rest/activitystreams/@me/@all/@all/" + id;
		
		// data to PUT
		var putData = {"actor": {"id": "@me"},
			"id": id,
			"connections": {
				"saved":  flag
			}
		};
		
		// PUT it
		this._doRequest("PUT", path, putData, callback);
	},
	this._getOption = function(options, key, defaultValue) {
		return (options && options[key]) ? options[key] : defaultValue;
	},
	this._doRequest = function(method, path, input, callback) {
		// create options for request
		var reqOptions = {
			"host": hostname,
			"path": path,
			"method": method.toUpperCase(),
			"headers": {
				"Authorization": this._getCredentials()
			}
		}
		if (input) {
			reqOptions.headers["Content-Type"] = "application/json";
			reqOptions.headers["Content-Length"] = JSON.stringify(input).length;
		}
		
		// do request
		var req = https.request(reqOptions, function(res) {
			var result = "";
			res.on("data", function(data) {
				result += data;
			});
			res.on("end", function() {
				try {
					var j = JSON.parse(result);
					callback(j, result);
				} catch (e) {
					process.stdout.write("ERROR <" + e + ">\n");
				}
			});
		});
		if (input) req.write(JSON.stringify(input));
		req.end();
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
	}
	this.finalize = function() {
		return this.result;
	}
}

// exports
exports.AS = AS;
exports.Entry = Entry;
