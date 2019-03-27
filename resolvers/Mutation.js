const { ObjectID } = require('mongodb')

module.exports = {

  async postPeople(parent, args, { db }) {

    console.log(`args.input.squads=${args.input.squads}`);
    const newPerson = {
      ...args.input,
      squads: [
        ObjectID(args.input.squads)
      ]
    }

    const { insertedIds } = await db.collection('People').insert(newPerson)
    newPerson._id = insertedIds[0]

    console.log(`args.input.squads2=${args.input.squads}, newPerson._id=${newPerson._id}`);

    await db.collection('Squads')
      .update({ _id: ObjectID(args.input.squads) }, { $push: { members: newPerson._id } })

    return newPerson

    // return db.collection('photos')
    //   .findOne({ _id: ObjectID(args.photoID) })

  }

}