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
	twitter.search("#ibmconnect", function(result) {
		process.stdout.write("Twitter search resulted in <" + result.statuses.length + "> results\n");
		
		// loop
		for (var i=0; i<result.statuses.length; i++) {
			var status = new twitter.Status(result.statuses[i]);
			if (status.getSender() == LOOKFOR_USERNAME || status.hasMention(LOOKFOR_USERNAME)) {
				// found tweet mentioning username
				process.stdout.write("Found match - posting to AS\n");
				
				// compose strings
				var objectId = status.getID();
				var displayName = "Tweet mentioning himself...";
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
				summary += "</td><td valign=\"top\">@" + status.getSender() + ": <i>" + status.getText() + "</i></td></tr></table>";
				
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
				as.post(entry, {"streamid": "@me"}, function(result) {
					if (status.hasMention(LOOKFOR_USERNAME) && result) {
						var entryId = result.entry.id;
						as.save(entryId, true, function(result) {
							process.stdout.write(JSON.stringify(result) + "\n");
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

