const kafka = require('kafka-node');

const kafkaClient = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_CLIENT_HOST });
const Producer = kafka.Producer;
const Consumer = kafka.Consumer;


module.exports = {
    kafkaClient,
    Producer,
    Consumer
}