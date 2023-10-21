const dotenv = require("dotenv");
const { readSampleContentList } = require("./libs/data");
const { withOpenAi } = require("./libs/openai");
const { withMongoDb } = require("./libs/mongodb");

async function main() {
	dotenv.config();

	const { generateEmbeddedVector } = await withOpenAi({
		secret: process.env.OPENAI_SECRET,
	});
	const { upsertContentById, closeConnection } = await withMongoDb({
		connection: process.env.MONGODB_CONNECTION,
		database: process.env.MONGODB_DATABASE,
		collection: process.env.MONGODB_COLLECTION,
	});

	const contentList = await readSampleContentList();
	for (const content of contentList) {
		try {
			console.log("Seeding content:", content.id);
			await upsertContentById(content, {
				generateEmbeddedVectorForContent: async (content) => {
					return generateEmbeddedVector(`${content.title}\n\n${content.abstract}\n\n${content.content}`);
				},
			});
			console.log("Seeding content completed:", content.id);
		} catch (err) {
			console.error("Seeding content failed:", err);
		}
	}

	await closeConnection();
	console.log("Seeding all contents completed");
}

main();
