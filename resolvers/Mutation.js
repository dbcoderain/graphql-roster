const { ObjectID } = require('mongodb')

module.exports = {

  async postPeople(parent, args, { db }) {

    const squadIDs = args.input.squads.map(squad => {
      return ObjectID(squad)
    });

    const newPerson = {
      ...args.input,
      jobRole: ObjectID(args.input.jobRole),
      squads: squadIDs
    }

    const { insertedIds } = await db.collection('People').insert(newPerson)
    newPerson._id = insertedIds[0]

    for (let i = 0; i < squadIDs.length; i++) {
      await db.collection('Squads')
        .update({ _id: ObjectID(squadIDs[i]) }, { $push: { members: newPerson._id } })
    }

    return newPerson

  }

}