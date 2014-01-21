// require
var fs = require("fs");

exports.setColor = function(filename, color) {
	fs.writeFile(filename, color + "\n");
}
