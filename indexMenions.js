/* *****
IBM Connect 2014 - BP301 by Mikkel Flindt Heisterberg is licensed under a 
Creative Commons Attribution-ShareAlike 4.0 International License.

http://creativecommons.org/licenses/by-sa/4.0/deed.en_US
***** */

// constants
var RELOAD_DELAY_SECONDS = 15;

// requires
var cnx = require("./connections");

// create activity stream
var as = new cnx.AS("connections.connect2014.com");

// callback for search
var callback = function(data) {
	if (!data || data.totalResults <= 0) {
		process.stdout.write("Bummer - no one is mentioning you...\n");
	} else {
		process.stdout.write("Important aren't you - found <" + result.totalResults + "> mentions...\n");
	}
	
	// reschedule
	setTimeout(doSearch, (RELOAD_DELAY_SECONDS || 15) * 1000);
}

// search function
var doSearch = function() {
	// do AS GET for mentions
	process.stdout.write("------------------------------------------------\n");
	as.get(callback, {"groupid": "@mentions"});
}
doSearch();

