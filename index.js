const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const { MongoClient } = require('mongodb')
const { readFileSync } = require('fs')
const expressPlayground = require('graphql-playground-middleware-express').default
const resolvers = require('./resolvers')
const squadsData = readFileSync('./data/squads.json')
const peopleData = readFileSync('./data/people.json')
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
    console.log('************ LOADING DATA **************');
    const squads = JSON.parse(squadsData);
    const people = JSON.parse(peopleData);
    console.log(`ready... ${JSON.stringify(squads)}`);
    for (let i = 0; i < squads.length; i++) {
      const args = {
        input: {
          name: squads[i].name,
          mission: squads[i].mission
        }
      }
      const newSquad = await resolvers.Mutation.postSquad(null, args, { db });
      console.log(`saved... ${JSON.stringify(newSquad)}`);
    }

    const jobRoles = await resolvers.Query.getJobRoles(null, null, { db });

    for (let i = 0; i < people.length; i++) {
      const jobRole = jobRoles.filter(x => x.name === people[i].jobRole)[0];
      const squadsArray = people[i].squads.split(',');
      const squads = [];
      for (let x = 0; x < squadsArray.length; x++) {
        const squad = await resolvers.Query.Squads(null, { name: squadsArray[x] }, { db });
        console.log(`matched squad for: ${squadsArray[x]} with: ${JSON.stringify(squad)}`)
        squads.push(squad._id);
      }
      const args = {
        input: {
          name: people[i].name,
          office: people[i].office,
          jobRole: jobRole._id,
          squads: squads
        }
      }
      console.log(`SAVING... ${JSON.stringify(args)}`);
      const newPeople = await resolvers.Mutation.postPeople(null, args, { db });
      console.log(`SAVED.... ${JSON.stringify(newPeople)}`);
    }
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

