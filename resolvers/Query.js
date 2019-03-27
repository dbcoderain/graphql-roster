const { ObjectID } = require('mongodb')

module.exports = {

    getSquads: (parent, args, { db }) =>
      db.collection('Squads')
        .find()
        .toArray(),

    getPeople: (parent, args, { db }) =>
      db.collection('People')
        .find()
        .toArray(),

    People: (parent, args, { db }) =>
      db.collection('People')
        .findOne({ name: args.name })

}