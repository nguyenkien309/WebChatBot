const mongoose = require('mongoose');
const reportSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    content: {
        type: String,
        required: true,
        minlength: 3,
    },
}, {
    timestamps: true,
})
const report = mongoose.model('report', reportSchema);
module.exports = report;