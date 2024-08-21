const { Producer, kafkaClient } = require('./init');

const kafkaProducer = new Producer(kafkaClient);

kafkaProducer.on('ready', () => {
    console.log('Kafka Producer is connected and ready.');
});

kafkaProducer.on('error', (err) => {
    console.error('Kafka Producer error:', err);
});

const sendKafkaMessage = ({ topic, message }) => {
    return new Promise((resolve, reject) => {
        const payloads = [
            { topic: topic, message }
        ];

        kafkaProducer.send(payloads, (err, data) => {
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

module.exports = { sendKafkaMessage, kafkaClient };