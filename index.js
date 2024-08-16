require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.USER_SERVICE_PORT || 3000;
const router = require('./routes/index');

app.use(express.json());

app.use('/api/v1/users', router);

const server = app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`);
});

module.exports = { app, server };