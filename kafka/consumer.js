const userService = require('../services/userService');
const { USER_TOPIC } = require('../constants/kafkaTopic');
const { activeServiceConsumer, createTopicIfNotExists } = require('../utils/kafka/consumer');

const activeUserServiceConsumer = async () => {
    await createTopicIfNotExists([{ topic: USER_TOPIC.REQUEST }]);
    activeServiceConsumer({
        serviceInstance: userService,
        topic: USER_TOPIC.REQUEST
    });
}

module.exports = { activeUserServiceConsumer };
