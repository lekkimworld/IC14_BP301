/* *****
IBM Connect 2014 - BP301 by Mikkel Flindt Heisterberg is licensed under a 
Creative Commons Attribution-ShareAlike 4.0 International License.

http://creativecommons.org/licenses/by-sa/4.0/deed.en_US
***** */

// declarations
var CONSUMER_KEY = "N0nfvxV5h70sVX8zVqRSA";
var CONSUMER_SECRET = "sjgRR6AgPFXOmttE1vKAtroabAwFq0MJZghkubzlM";

/**
 * Base64 encoder.
 */
var base64 = function(input) {
	return new Buffer(input).toString('base64');
}

var doCredentials = function(username, password) {
	return base64(username + ":" + password);
}
/**
 * Get credentials for Twitter API.
 */
var twitterCredentials = function() {
	return doCredentials(encodeURIComponent(CONSUMER_KEY), encodeURIComponent(CONSUMER_SECRET));
}
/**
 * Get credentials for Connections API.
 */
var cnxCredentials = function() {
	return doCredentials("915741", "554224");
}

// export
exports.twitterCredentials = twitterCredentials;
exports.cnxCredentials = cnxCredentials;
