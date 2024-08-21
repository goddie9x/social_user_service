const userService = require('../services/userService');
const { kafkaClient, Consumer } = require('./init');
const { USER_TOPIC } = require('../constants/kafkaTopic');

const activeUserServiceConsumer = () => {
    const userServiceConsumer = new Consumer(kafkaClient, [{ topic: USER_TOPIC.REQUEST }], { autoCommit: true });

    userServiceConsumer.on('message', async (messages) => {

        try {
            const { action, ...data } = JSON.parse(messages.value);

            if (typeof userService[action] === 'function') {
                response = await userService[action](data);
            }
        } catch (error) {
            console.error('Error processing Kafka message:', error);
        }
    });

    userServiceConsumer.on('error', (err) => {
        console.error('Kafka Consumer error:', err);
    });
}

module.exports = { activeUserServiceConsumer };
