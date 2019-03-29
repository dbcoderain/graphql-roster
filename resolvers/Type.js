module.exports = {

    Squads: {
        members: (parent, args, { db }) =>
            db.collection('People')
                .find({ _id: { $in: parent.members } })
                .toArray()
    },

    People: {
        jobRole: (parent, args, { db }) =>
            db.collection('JobRole')
            .findOne({ _id: parent.jobRole }),

        squads: (parent, args, { db }) =>
            db.collection('Squads')
                .find({ _id: { $in: parent.squads } })
                .toArray()
    },

    JobRole: {
        members: (parent, args, { db }) =>
            db.collection('People')
                .find({ jobRole: parent._id })
                .toArray()
    }

}