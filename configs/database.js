const mongoose = require('mongoose');
const connectToDB = require('@godsocial/utils/configs/singleMongoDb');

connectToDB(mongoose, process.env.MONGODB_URI);

module.exports = mongoose;