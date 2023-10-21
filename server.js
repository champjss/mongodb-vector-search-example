const dotenv = require("dotenv")
const fastify = require("fastify");
const { withOpenAi } = require("./libs/openai");
const { withMongoDb } = require("./libs/mongodb");

async function main() {
	dotenv.config();

	const { generateEmbeddedVector } = await withOpenAi({
		secret: process.env.OPENAI_SECRET,
	});
	const { findSimilarDocuments } = await withMongoDb({
		connection: process.env.MONGODB_CONNECTION,
		database: process.env.MONGODB_DATABASE,
		collection: process.env.MONGODB_COLLECTION,
	});

	const server = fastify();
	server.get('/', async function(request) {
		const query = request.query.q;

		if (!query) {
			return {
				data: [],
			};
		}

		const vector = await generateEmbeddedVector(query);
		const result = await findSimilarDocuments(vector);
		return {
			data: result,
		};
	});

	await server.listen({
		host: "0.0.0.0",
		port: 3000,
	});
	console.log("Server started at http://localhost:3000\n\n");
	console.log("Try using this search: http://localhost:3000?q=วิเคราะห์เงินหมื่นกระตุ้นเศรษฐกิจ")
}

main();
