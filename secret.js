/* *****
IBM Connect 2014 - BP301 by Mikkel Flindt Heisterberg is licensed under a 
Creative Commons Attribution-ShareAlike 4.0 International License.

http://creativecommons.org/licenses/by-sa/4.0/deed.en_US
***** */

// declarations
var CONSUMER_KEY = "VJEYYqaws4u0OtFcI1qJiA";
var CONSUMER_SECRET = "wAC0OziMJpIl3k5hJx5YEOKdZKBp4YTeVBpE6m8A";

/**
 * Base64 encoder.
 */
var base64 = function(input) {
	return new Buffer(input).toString('base64');
}

/**
 * Get credentials for Twitter API.
 */
var doCredentials = function(username, password) {
	return base64(username + ":" + password);
}
var twitterCredentials = function() {
	return doCredentials(encodeURIComponent(CONSUMER_KEY), encodeURIComponent(CONSUMER_SECRET));
}
var cnxCredentials = function() {
	return doCredentials("915741", "554224");
}

// export
exports.twitterCredentials = twitterCredentials;
exports.cnxCredentials = cnxCredentials;
