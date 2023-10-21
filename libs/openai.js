const assert = require("assert");
const { default: axios } = require("axios");

async function withOpenAi(options) {
	const { secret } = options;
	assert(secret, "OpenAPI secret is required");

	const url = "https://api.openai.com/v1/embeddings";
	const model = "text-embedding-ada-002";

	return {
		generateEmbeddedVector: async (query) => {
			const simplifiedInput = query.substr(0, 8192);

			const response = await axios.post(
				url,
				{
					input: simplifiedInput,
					model: model,
				},
				{
					timeout: 20000,
					headers: {
						Authorization: `Bearer ${secret}`,
						"Content-Type": "application/json",
					},
				},
			);
			if (response.status !== 200) {
				throw new Error(`Failed to get embedding. Status code: ${response.status}`);
			}

			return response.data.data[0].embedding;
		}
	}
}

module.exports = {
	withOpenAi,
};
