/* *****
IBM Connect 2014 - BP301 by Mikkel Flindt Heisterberg is licensed under a 
Creative Commons Attribution-ShareAlike 4.0 International License.

http://creativecommons.org/licenses/by-sa/4.0/deed.en_US
***** */

// require
var https = require("https");

var AS = function(hostname, credentials) {
	this.read = function(callback, options) {
		// make sure there is a callback
		if (!callback) {
			throw new Error("Must have a callback - otherwise what's the point!?");
		}
		
		// get data
		var userid = (options && options.userid) ? options.userid : "@me";
		var groupid = (options && options.groupid) ? options.groupid : "@all";
		var appid = (options && options.appid) ? options.appid : "@all";
		
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
	}
}

// exports
exports.AS = AS;
