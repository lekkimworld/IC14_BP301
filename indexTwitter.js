/* *****
IBM Connect 2014 - BP301 by Mikkel Flindt Heisterberg is licensed under a 
Creative Commons Attribution-ShareAlike 4.0 International License.

http://creativecommons.org/licenses/by-sa/4.0/deed.en_US
***** */

// constants
var RELOAD_DELAY_SECONDS = 15;
var LOOKFOR_USERNAME = "lekkim";

// requires
var twitter = require("./twitter");
var cnx = require("./connections");

/** 
 * Does twitter search.
 */
var doSearch = function() {
	// create activity stream
	var as = new cnx.AS("connections.connect2014.com");
	
	// do twitter search
	process.stdout.write("------------------------------------------------\n");
	twitter.search("#ibmconnect", function(result) {
		process.stdout.write("\tTwitter search resulted in <" + result.statuses.length + "> result(s).\n");
		
		// function to determine include
		var saveStatus = function(status) {
			if (status.hasMention(LOOKFOR_USERNAME)) return true;
			if (status.hasMention("ontimesuite")) return true;
			if (status.getText().toLowerCase().indexOf("bp301") >= 0) return true;
			if (status.getText().toLowerCase().indexOf("bp309") >= 0) return true;
			return false;
		}
		// function to determine include
		var includeStatus = function(status) {
			if (status.getSender() == LOOKFOR_USERNAME) return true;
			if (saveStatus(status)) return true;
			return false;
		}
		
		// loop
		for (var i=0; i<result.statuses.length; i++) {
			var status = new twitter.Status(result.statuses[i]);
			if (includeStatus(status)) {
				// found tweet mentioning username
				process.stdout.write("Found match - posting to activity stream.\n");
				
				// compose strings
				var objectId = status.getID();
				var displayName = "Tweet mentioning himself (or his session(s)...";
				var content = "Tweet from " + status.getSender() + ": " + status.getText();
				var url = status.getURL();
				var summary = "<table border=\"0\"><tr><td width=\"65\" valign=\"top\">";
				if (null != status.getSenderProfileURL()) {
					summary += "<a href=\"" + status.getSenderProfileURL() + "\">";
				}
				summary += "<img src=\"" + status.getSenderImageURL() + "\">";
				if (null != status.getSenderProfileURL()) {
					summary += "</a>";
				}
				summary += "</td><td valign=\"top\">@" + 
					status.getSender() + ": <i>" + 
					status.getText() + "</i></td></tr></table>";
				
				// create entry
				var entry = new cnx.Entry()
					.I()
					.shared()
					.on(new Date())
					.content(content)
					.object({
						"objectType": "tweet",
						"displayName": displayName, 
						"summary": summary,
						"id": objectId,
						"url": url
					})
					.finalize();
					
				// post it
				as.post(entry, {"streamid": "@public"}, function(result) {
					process.stdout.write("\tPosted to activity stream.\n");
					
					// see if we should save it
					if (saveStatus(status)) {
						process.stdout.write("Activity Stream entry should be saved.\n");
						var entryId = result.entry.id;
						process.stdout.write("\tEntry id <" + entryId + ">\n");
						as.save(entryId, true, function(result) {
							process.stdout.write("\tSaved activity stream entry.\n");
						});
					}
				});
			}
		}
		
		// reschedule
		setTimeout(doSearch, (RELOAD_DELAY_SECONDS || 15) * 1000);
	});
}
doSearch();

