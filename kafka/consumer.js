const kafka = require('kafka-node');

const userController = require('../controllers/userController');
const { sendKafkaMessage, kafkaClient } = require('./producer');
const { USER_TOPIC } = require('../constants/kafkaTopic');

const Consumer = kafka.Consumer;
const consumer = new Consumer(kafkaClient, [{ topic: USER_TOPIC.REQUEST, partition: 0 }], { autoCommit: true });

const activeKafkaConsumer = () => {
    consumer.on('message', async (message) => {
        let response;
        try {
            const { requestId, action, ...data } = JSON.parse(message);

            if (typeof userController[action] === 'function') {
                response = await userController[action](data);
            }
        } catch (error) {
            console.error('Error processing Kafka message:', error);
        }
        sendKafkaMessage({ topic: USER_TOPIC.RESPONSE, messages: JSON.stringify({ requestId, response }) })
    });

    consumer.on('error', (err) => {
        console.error('Kafka Consumer error:', err);
    });
}

module.exports = activeKafkaConsumer;
