const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const { MongoClient } = require('mongodb')
const { readFileSync } = require('fs')
const expressPlayground = require('graphql-playground-middleware-express').default
const resolvers = require('./resolvers')
const dataLoader = require('./data/DataLoader')

const args = require('minimist')(process.argv.slice(2));

require('dotenv').config()
var typeDefs = readFileSync('./typeDefs.graphql', 'UTF-8')

async function start() {
  const app = express()
  const MONGO_DB = process.env.DB_HOST
  let db

  try {
    const client = await MongoClient.connect(MONGO_DB, { useNewUrlParser: true })
    db = client.db()
  } catch (error) {
    console.log(error);
    console.log(`
      Mongo DB Host not found!
      please add DB_HOST environment variable to .env file

      exiting...
    `)
    process.exit(1)
  }

  if (args.loadData) {
    await dataLoader.loadData({ db });
  } else {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: async ({ req }) => {
        return { db }
      }
    })

    server.applyMiddleware({ app })

    app.get('/playground', expressPlayground({ endpoint: '/graphql' }))

    app.get('/', (req, res) => {
      res.end('GraphQL Root Page')
    })

    app.listen({ port: 4000 }, () =>
      console.log(`GraphQL Server running at http://localhost:4000${server.graphqlPath}`)
    )
  }
}


start()

