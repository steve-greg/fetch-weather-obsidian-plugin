const fs = require("fs-extra");

const sourceDir = "./dist";
const targetDir =
	"C:\\Documents\\Development\\.obsidian\\plugins\\fetch-weather-plugin";

fs.copy(sourceDir, targetDir)
	.then(() => console.log("success!"))
	.catch((err) => console.error(err));
