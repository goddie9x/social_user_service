const { Producer, kafkaClient } = require('./init');

const kafkaProducer = new Producer(kafkaClient);

kafkaProducer.on('ready', () => {
    console.log('Kafka Producer is connected and ready.');
});

kafkaProducer.on('error', (err) => {
    console.error('Kafka Producer error:', err);
});

module.exports = { kafkaProducer, kafkaClient };