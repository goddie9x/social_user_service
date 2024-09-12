const userService = require('../services/userService');
const { kafkaClient } = require('../utils/kafka/producer');
const { USER_TOPIC } = require('../constants/kafkaTopic');
const { activeServiceConsumer } = require('../utils/kafka/consumer');

const activeUserServiceConsumer = () => {
    activeServiceConsumer({
        kafkaClient,
        serviceInstance: userService,
        topic: USER_TOPIC.REQUEST
    });
}

module.exports = { activeUserServiceConsumer };
