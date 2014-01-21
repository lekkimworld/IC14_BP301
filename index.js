/* *****
IBM Connect 2014 - BP301 by Mikkel Flindt Heisterberg is licensed under a 
Creative Commons Attribution-ShareAlike 4.0 International License.

http://creativecommons.org/licenses/by-sa/4.0/deed.en_US
***** */

// constants
var RELOAD_DELAY_SECONDS = 10;

// requires
var secret = require("./secret");
var twitter = require("./twitter");
var mthing = require("./mthing");

/** 
 * Does twitter search.
 */
var doSearch = function() {
	twitter.search("#ibmconnect", secret.credentials, function(result) {
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
doSearch();

mthing.setColor("color.txt", "#ff0000");
