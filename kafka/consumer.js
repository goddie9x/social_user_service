const userService = require('../services/userService');
const { kafkaClient } = require('./init');
const { USER_TOPIC } = require('../constants/kafkaTopic');
const { activeServiceConsumer } = require('../utils/kafka');

const activeUserServiceConsumer = () => {
    activeServiceConsumer({
        kafkaClient,
        serviceInstance: userService,
        topic: USER_TOPIC.REQUEST
    });
}

module.exports = { activeUserServiceConsumer };
