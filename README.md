# MongoDB Vector Search Example

This project is a proof-of-concept of using MongoDB's vector search feature,
providing sample contents to seed into the database, and a simple API to search them.

## Requirements

* MongoDB 7.0 (Right now can be used only on MongoDB Atlas)
* NodeJS

## Installation and running

- `npm install` to installing the dependencies
- Then, copy `.env.example` to `.env` and editing the configuration
- Run `node seed.js` to insert sample data into the database
- Run `node server.js` to start server
- Try searching with `http://localhost:3000?q=<search_term>`

## Configuration

```
MONGODB_CONNECTION=mongodb+srv://<username>:<password>@<host>/?retryWrites=true&w=majority
MONGODB_DATABASE=demo
OPENAI_SECRET=secret
```

* For MongoDB-related config, you can create a new database deployment, and click **Connect** button for information.
* For `OPENAI_SECRET`, can be get at [API Keys](https://platform.openai.com/account/api-keys) page.

## Learn more

* [https://www.mongodb.com/docs/atlas/atlas-vector-search/vector-search-overview/#perform-semantic-search-with-atlas-vector-search](https://www.mongodb.com/docs/atlas/atlas-vector-search/vector-search-overview/)

## Thanks

* Sample news content from [Thai PBS](https://www.thaipbs.or.th)