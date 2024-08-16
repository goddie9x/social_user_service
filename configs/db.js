const mongoose = require('mongoose');

const connectToDD = async (url, callback) => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("connect db successfully");
    } catch (error) {
        console.log(error);
    }
}

module.exports = mongoose;