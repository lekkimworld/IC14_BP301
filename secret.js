/* *****
IBM Connect 2014 - BP301 by Mikkel Flindt Heisterberg is licensed under a 
Creative Commons Attribution-ShareAlike 4.0 International License.

http://creativecommons.org/licenses/by-sa/4.0/deed.en_US
***** */

/**
 * Base64 encoder.
 */
var base64 = function(input) {
	return new Buffer(input).toString('base64');
}

/**
 * Format credentials.
 */
var credentials = function(username, password, encode) {
	return base64(
		(encode ? encodeURIComponent(username) : username) + 
		":" + 
		(encode ? encodeURIComponent(password) : password));
}

// export
exports.credentials = credentials;
