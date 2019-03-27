const { ObjectID } = require('mongodb')

module.exports = {

  async postPeople(parent, args, { db }) {

    const newPerson = {
      ...args.input,
      squads: [
        ObjectID(args.input.squads)
      ]
    }

    const { insertedIds } = await db.collection('People').insert(newPerson)
    newPerson._id = insertedIds[0]

    await db.collection('Squads')
      .update({ _id: ObjectID(args.input.squads) }, { $push: { members: newPerson._id } })

    return newPerson

  }

}