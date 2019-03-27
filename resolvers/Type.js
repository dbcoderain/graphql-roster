module.exports = {

    Squads: {
        members: (parent, args, { db }) =>
            db.collection('People')
                .find({ _id: { $in: parent.members } })
                .toArray()
    },

    People: {
        squads: (parent, args, { db }) =>
            db.collection('Squads')
                .find({ _id: { $in: parent.squads } })
                .toArray()
    }

}