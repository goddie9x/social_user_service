require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const router = require('./routes/index');
const activeKafkaConsumer = require('./kafka/consumer');

app.use(express.json());

app.use('/api/v1/users', router);

activeKafkaConsumer();

const server = app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`);
});

module.exports = { app, server };