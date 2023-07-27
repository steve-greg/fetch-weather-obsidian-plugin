const fs = require("fs-extra");

var args = process.argv.slice(2);
console.log(args[0]);

if (args.length < 1) {
	console.warn("Please provide a target publish path");
	return;
}

const sourceDir = "./dist";
const targetDir = args[0];

fs.copy(sourceDir, targetDir)
	.then(() => console.log("success!"))
	.catch((err) => console.error(err));
