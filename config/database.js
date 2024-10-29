const mongoose = require('mongoose');
require('dotenv').config();

module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connect Success!");
    } catch (error) {
        console.log("connect Error!");
    }
};