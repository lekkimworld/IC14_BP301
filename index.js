/* *****
IBM Connect 2014 - BP301 by Mikkel Flindt Heisterberg is licensed under a 
Creative Commons Attribution-ShareAlike 4.0 International License.

http://creativecommons.org/licenses/by-sa/4.0/deed.en_US
***** */

// constants
var RELOAD_DELAY_SECONDS = 10;

// requires
var twitter = require("./twitter");
var cnx = require("./connections");

/** 
 * Does twitter search.
 */
var doSearch = function() {
	twitter.search("#ibmconnect", function(result) {
		console.log(result.statuses.length + " results");
		
		for (var i=0; i<result.statuses.length; i++) {
			var status = new twitter.Status(result.statuses[i]);
			if (status.hasMention()) {
				process.stdout.write(status.getText());
				process.stdout.write("\n");
				process.stdout.write("Found mentions <" + status.getMentions() + ">\n");
			}
		}
		
		// reschedule
		setTimeout(doSearch, (RELOAD_DELAY_SECONDS || 10) * 1000);
	});
}
//doSearch();

var as = new cnx.AS("connections.connect2014.com");
/*
as.get(function(data) {
	process.stdout.write(JSON.stringify(data.list));
}, {groupid: "@actions"});
*/

var entry = new cnx.Entry()
	.I()
	.posted()
	.on(new Date())
	.object({
		"objectType": "note",
		"displayName": "Sales meeting", 
		"summary": "Sales meeting w/ senior staff", 
		"id": new Date().getTime() + ""
	})
	.connections({
		"saved": true
	});
as.post(entry, function() {});

