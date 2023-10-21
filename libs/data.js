const fs = require("node:fs/promises");

async function readSampleContentList() {
	return fs.readFile("./resources/contents.json", "utf8").then((contents) => {
		return JSON.parse(contents).data;
	});
}

module.exports = {
	readSampleContentList,
};
