const mongoose = require('mongoose');
const connectToDB = require('../utils/configs/singleMongoDb');

connectToDB(mongoose, process.env.MONGODB_URI);

module.exports = mongoose;