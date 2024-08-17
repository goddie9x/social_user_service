const kafka = require('kafka-node');

const kafkaClient = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_CLIENT_HOST });
const kafkaProducer = new kafka.Producer(kafkaClient);

kafkaProducer.on('ready', () => {
    console.log('Kafka Producer is connected and ready.');
});

kafkaProducer.on('error', (err) => {
    console.error('Kafka Producer error:', err);
});

const sendKafkaMessage = ({ topic, messages }) => {
    return new Promise((resolve, reject) => {
        const payloads = [
            { topic: topic, messages: JSON.stringify(messages) }
        ];

        producer.send(payloads, (err, data) => {
            if (err) {
                console.error('Error sending message:', err);
                reject(err);
            } else {
                console.log('Message sent successfully:', data);
                resolve(data);
            }
        });
    });
};

module.exports = { kafkaProducer, sendKafkaMessage, kafkaClient };