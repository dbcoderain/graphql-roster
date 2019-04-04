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

    getJobRoles: (parent, args, { db }) =>
      db.collection('JobRole')
        .find()
        .toArray(),

    People: (parent, args, { db }) =>
      db.collection('People')
        .findOne({ name: args.name }),

    Squads: (parent, args, { db }) =>
      db.collection('Squads')
        .findOne({ name: args.name })

}