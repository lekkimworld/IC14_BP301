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
var credentials = function() {
	return base64(encodeURIComponent(CONSUMER_KEY) + ":" + encodeURIComponent(CONSUMER_SECRET));
}

// export
exports.credentials = credentials;
