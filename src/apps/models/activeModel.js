const mongoose = require('mongoose');

const activeSchema = mongoose.Schema({
    time: {
        type: Date,
        default: Date.now
    },
    count:{
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
})
const active = mongoose.model('active', activeSchema);
module.exports = active;