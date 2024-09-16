const userService = require('../services/userService');
const { USER_TOPIC } = require('../constants/kafkaTopic');
const { activeServiceConsumer } = require('../utils/kafka/consumer');

const activeUserServiceConsumer = () => {
    activeServiceConsumer({
        serviceInstance: userService,
        topic: USER_TOPIC.REQUEST
    });
}

module.exports = { activeUserServiceConsumer };
