const { PubSub } = require('apollo-server-express');
const pubsub = new PubSub();

const TOPIC = 'infoTopic';

module.exports = {

    info: {
      subscribe: () => pubsub.asyncIterator([TOPIC]),
    }

}