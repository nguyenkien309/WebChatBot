const mongoose = require('mongoose');
const config = require('config');
const MONGODB_URI = config.get("app").MONGODB_URI;
module.exports.connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGODB_URI).then(() => {
            console.log(`MongoDB connected`);
        });
        return conn;
    } catch (error) {
        console.error(`Error: ${error}`);
        // process.exit(1);
    }
}
