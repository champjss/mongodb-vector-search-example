const assert = require("assert");
const { ServerApiVersion } = require("mongodb");
const { MongoClient } = require("mongodb");

async function withMongoDb(options) {
	const { connection, database, collection = "contents" } = options;
	assert(connection, "MongoDB connection string is required");
	assert(database, "MongoDB database string is required");

	const client = new MongoClient(connection, {
		serverApi: {
			version: ServerApiVersion.v1,
			strict: false,
			deprecationErrors: true,
		},
	});

	await client.connect();
	const clientDb = client.db(database);
	const clientCollection = clientDb.collection(collection);

	return {
		upsertContentById: async (content, { generateEmbeddedVectorForContent }) => {
			assert(content.id, "content ID is required")
			assert(generateEmbeddedVectorForContent, "generateEmbeddedVectorForContent function is required");

			const vectorEmbeded = await generateEmbeddedVectorForContent(content);
			await clientCollection.updateOne(
				{ id: content.id },
				{
					$set: {
						...content,
						plot_embedding: vectorEmbeded,
					},
				},
				{ upsert: true },
			);
		},
		findSimilarDocuments: async (embedding) => {
			const contentCursor = await clientCollection.aggregate([
				{
					$vectorSearch: {
						queryVector: embedding,
						path: "plot_embedding",
						numCandidates: 100,
						limit: 5,
						index: "knn",
					},
				},
				{
					$project: {
						id: 1,
						title: 1,
						abstract: 1,
					},
				},
			]);
			const contentList = await contentCursor.toArray();
			return contentList;
		},
		closeConnection: async () => client.close(),
	};
}

module.exports = {
	withMongoDb,
};
